/**
 * Utilities for interacting with `variables` from the
 * `/configure` response
 */

import {
  ConfigurationVariable,
  ConfigureResponse,
  RemovedAssignment,
  SingletonValue,
  isIntervalValue,
  isSingletonValue,
} from '../../../api/types/configurator';
import { UIAssignment, UIConflict } from './assignment-utils';

/**
 * Get all values for `variable` that have a state.
 *
 * If `variable.allowMultipleAssignments` then returned array contains both
 * excluded and included values.
 */
function getValuesWithState(variable: ConfigurationVariable) {
  const values =
    variable.values?.flatMap((v) => (v?.excluded ? [v, v.excluded] : [v])) ||
    [];
  return variable.allowMultipleAssignments ? values : variable.values || [];
}

/**
 * Get the first value assigned to the variable.
 */
export function getAssignedValue(
  variable: ConfigurationVariable
): SingletonValue | undefined {
  return variable.values?.find((v) => v.assigned);
}

/**
 * Does the variable have an assigned value.
 */
export function hasAssignedValue(variable: ConfigurationVariable) {
  return getValuesWithState(variable).some((v) => v.assigned);
}

/**
 * Does the variable have any system assigned value.
 */
export function hasSystemAssignedValue(variable: ConfigurationVariable) {
  return getValuesWithState(variable).some(
    (v) => v.assigned === 'byRule' || v.assigned === 'byPhase'
  );
}

/**
 * Does the variable have any user assigned value.
 */
export function hasUserAssignedValue(variable: ConfigurationVariable) {
  return getValuesWithState(variable).some((v) => v.assigned === 'byUser');
}

/**
 * Get variable property with id or undefined if variable doesn't have
 * a property with *name*
 */
export function getProperty(variable: ConfigurationVariable, id: string) {
  return variable.properties?.find((p) => p.id === id);
}

/**
 * Is variable required, but have no assigned value.
 */
export function isRequiredWithoutAssignment(variable: ConfigurationVariable) {
  return (
    !hasAssignedValue(variable) &&
    (getProperty(variable, 'required') || {}).value
  );
}

/**
 * Should the variable be shown (have a show property with a true value).
 */
export function showVariable(variable: ConfigurationVariable) {
  return (getProperty(variable, 'show') || { value: true }).value;
}

/**
 * Return a formatted string of available values.
 */
export function formatAvailableValues(
  variable: ConfigurationVariable,
  truncateAfter = 10,
  separator = ',',
  valueFormatter = (v: any) => v
) {
  if (!variable.values) {
    return '';
  }
  const availableValues = variable.values
    .filter((v) => !v.incompatible)
    .map((v) => {
      if (isIntervalValue(v)) {
        return `${valueFormatter(v.lower)} - ${valueFormatter(v.upper)}`;
      } else if (isSingletonValue(v)) {
        return valueFormatter(v.value);
      }
      return '';
    });
  let formattedValues = availableValues
    .slice(0, truncateAfter)
    .join(`${separator} `);

  if (availableValues.length > truncateAfter) {
    formattedValues = formattedValues.concat(`${separator} …`);
  }
  return formattedValues;
}

/**
 * Get a conflict structure, containing currentAssignment and removedAssignments.
 */
export function getConflict(
  currentAssignment?: UIAssignment,
  removedAssignments?: RemovedAssignment[],
  nextResult?: ConfigureResponse
): UIConflict | null {
  if (!currentAssignment) {
    return null;
  }
  if (!removedAssignments || !removedAssignments.length) {
    return null;
  }
  if (
    removedAssignments.length === 1 &&
    removedAssignments[0].variable?.id === currentAssignment.variable?.id &&
    removedAssignments[0].value?.value === currentAssignment.value?.value
  ) {
    return null;
  }

  const { removedAssignments: ra, ...result } = nextResult || {
    removedAssignments: {},
  };

  return {
    currentAssignment,
    removedAssignments,
    nextResult: result,
  };
}
