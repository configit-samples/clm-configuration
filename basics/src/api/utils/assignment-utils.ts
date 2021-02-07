/**
 * Utilities for dealing with assignments which are input
 * to the `/configure` API
 */
import {
  ConfigurationVariable,
  ConfigureResponse,
  RemovedAssignment,
  SingletonValue,
} from '../types/configurator';

export type UIAssignment = {
  variable: ConfigurationVariable;
  value?: SingletonValue;
  phase?: number;
};
export type UIConflict = {
  currentAssignment: RemovedAssignment;
  removedAssignments: RemovedAssignment[];
  nextResult: ConfigureResponse;
};

/**
 * Are two assignments equal
 */
const assignmentEq = (
  as1: UIAssignment | RemovedAssignment,
  as2: UIAssignment | RemovedAssignment
) => {
  if (as1.value) {
    return (
      as1.variable?.id === as2.variable?.id &&
      as1.value.value === as2.value?.value
    );
  }
  return as1.variable?.id === as2.variable?.id;
};

/**
 * Convert variable, value, exclude flag to assignment object
 * ready for configuration requests
 */
export function toAssignment(
  variable: ConfigurationVariable,
  value?: SingletonValue
): UIAssignment {
  return {
    variable: {
      id: variable.id,
      name: variable.name,
      valueType: variable.valueType,
      allowMultipleAssignments: variable.allowMultipleAssignments,
    },
    value,
  };
}

export function toUIAssignment(
  removedAssignment: RemovedAssignment
): UIAssignment {
  return {
    variable: { ...removedAssignment.variable },
    value: { ...removedAssignment.value },
  };
}

/**
 * Returns new assignments array, where the assignments have been removed.
 */
export function removeAssignments(
  variableAssignments: UIAssignment[],
  assignments: RemovedAssignment[]
) {
  return variableAssignments.filter(
    (va) => !assignments.some((a) => assignmentEq(a, va))
  );
}

/**
 * Returns new assignments array, where the assignment have been removed.
 */
export const unassign = (
  variableAssignments: UIAssignment[],
  assignment: UIAssignment
) => {
  return variableAssignments.filter((a) => !assignmentEq(assignment, a));
};

/**
 * Return a new assignments array, where the assignment have been added.
 * For single value variables any previous assignment to the
 * assignment.variable is removed.
 */
export const assign = (
  variableAssignments: UIAssignment[],
  assignment: UIAssignment
) => {
  let assignmentToRemove = assignment;
  if (!assignment.variable?.allowMultipleAssignments) {
    assignmentToRemove = { variable: { id: assignment.variable?.id } };
  }
  return [...unassign(variableAssignments, assignmentToRemove), assignment];
};

/**
 * Return a new assignments array, where assignments to phases
 * after and including phase have been removed.
 */
export const reset: () => UIAssignment[] = () => [];
