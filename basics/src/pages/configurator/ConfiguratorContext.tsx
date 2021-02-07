import React, {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from 'react';
import callConfigure from '../../api/configure';
import * as utils from '../../api/utils/assignment-utils';
import {
  ConfigurationVariable,
  ConfigureResponse,
  SingletonValue,
} from '../../api/types/configurator';
import { globalArguments } from '../../globalArguments';

export const NO_VIEW = 'NO.VIEW';

type ConfiguratorState = {
  configuration?: ConfigureResponse;
  error?: Error;
  loading?: boolean;
};

type ConfiguratorContextType = ConfiguratorState & {
  assignments: utils.UIAssignment[];
  currentLanguage?: string;
  currentView?: string;
  setView: (view: string) => void;
  setLanguage: (view: string) => void;
  assign: (variable: ConfigurationVariable, value: SingletonValue) => void;
  unAssign: (variable: ConfigurationVariable, value?: SingletonValue) => void;
  reset: (phase?: number) => void;
};

const initialContextValue = {
  assignments: [],
  assign: () => {},
  unAssign: () => {},
  reset: () => {},
  setView: () => {},
  setLanguage: () => {},
};
export const ConfiguratorContext = React.createContext<ConfiguratorContextType>(
  initialContextValue
);

export function useConfigurator() {
  return useContext(ConfiguratorContext);
}

type FetchSuccessPayload = {
  configuration: ConfigureResponse;
};
type FetchErrorPayload = {
  error: Error;
};

type Action =
  | { type: 'configure-start' }
  | { type: 'configure-success'; payload: FetchSuccessPayload }
  | { type: 'configure-error'; payload: FetchErrorPayload };

function reducer(state: ConfiguratorState, action: Action): ConfiguratorState {
  switch (action.type) {
    case 'configure-start':
      return { ...state, loading: true };
    case 'configure-success':
      return {
        ...state,
        loading: false,
        configuration: action.payload.configuration,
      };
    case 'configure-error':
      return { ...state, loading: false, error: action.payload.error };
  }
  return state;
}

export type ConfiguratorProviderProps = {
  productId: string;
  children: ReactNode;
  initialView?: string;
  initialLanguage?: string;
  initialAssignments?: utils.UIAssignment[];
};

const today = new Date(Date.now()).toISOString();

export function ConfiguratorProvider({
  productId,
  initialView,
  initialLanguage,
  initialAssignments,
  children,
}: ConfiguratorProviderProps) {
  const assignmentsRef = useRef<utils.UIAssignment[]>(initialAssignments || []);
  const languageRef = useRef<string | undefined>(initialLanguage);
  const viewRef = useRef<string | undefined>(initialView);

  const [state, dispatch] = useReducer(reducer, {});

  const configure = useCallback(
    async (
      assignments: utils.UIAssignment[],
      view?: string,
      language?: string
    ) => {
      dispatch({ type: 'configure-start' });

      try {
        const configuration = await callConfigure({
          date: today,
          language,
          viewId: view === NO_VIEW ? undefined : view,
          globalArguments: globalArguments,
          line: {
            productId,
            variableAssignments: assignments.map((a) => ({
              variableId: a.variable?.id,
              value: a.value?.value,
              exclude: !!a.value?.excluded,
            })),
          },
        });

        if (configuration.removedAssignments?.variableAssignments) {
          assignmentsRef.current = utils.removeAssignments(
            assignments,
            configuration.removedAssignments.variableAssignments
          );
        } else {
          assignmentsRef.current = assignments;
        }
        languageRef.current = language;
        viewRef.current = view;

        dispatch({ type: 'configure-success', payload: { configuration } });
      } catch (error) {
        dispatch({ type: 'configure-error', payload: { error } });
      }
    },
    [productId]
  );

  const assign = useCallback(
    (variable: ConfigurationVariable, value: SingletonValue) => {
      const currentAssignment = utils.toAssignment(variable, value);
      const assignments = utils.assign(
        assignmentsRef.current,
        currentAssignment
      );

      configure(assignments, viewRef.current, languageRef.current);
    },
    [configure]
  );

  const unAssign = useCallback(
    (variable: ConfigurationVariable, value?: SingletonValue) => {
      const currentAssignment = utils.toAssignment(variable, value);
      const assignments = utils.unassign(
        assignmentsRef.current,
        currentAssignment
      );

      configure(assignments, viewRef.current, languageRef.current);
    },
    [configure]
  );

  const reset = useCallback(
    (phase?: number) => {
      configure(initialAssignments || [], viewRef.current, languageRef.current);
    },
    [configure, initialAssignments]
  );

  const setLanguage = useCallback(
    (language: string) => {
      configure(assignmentsRef.current, viewRef.current, language);
    },
    [configure]
  );

  const setView = useCallback(
    (view: string) => {
      configure(assignmentsRef.current, view, languageRef.current);
    },
    [configure]
  );

  useEffect(() => {
    configure(initialAssignments || [], initialView, initialLanguage);
  }, [configure, initialAssignments, initialView, initialLanguage]);

  const value = {
    ...state,
    currentView: viewRef.current,
    currentLanguage: languageRef.current,
    assignments: assignmentsRef.current,
    assign,
    unAssign,
    reset,
    setView,
    setLanguage,
  };

  return (
    <ConfiguratorContext.Provider value={value}>
      {children}
    </ConfiguratorContext.Provider>
  );
}
