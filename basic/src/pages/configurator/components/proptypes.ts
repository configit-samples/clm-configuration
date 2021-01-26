import {
  ConfigurationVariable,
  SingletonValue,
  RemovedAssignments,
} from '../../../api/types/configurator';

export type VariableControlProps = {
  variable: ConfigurationVariable;
  onAssign: (v: ConfigurationVariable, value: SingletonValue) => void;
  onUnassign: (v: ConfigurationVariable, value?: SingletonValue) => void;
  removedAssignments?: RemovedAssignments;
};
