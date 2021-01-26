import React from 'react';
import classnames from 'classnames';
import './TextInput.css';
import {
  getAssignedValue,
  formatAvailableValues,
} from '../utils/variable-utils';
import Input from '../../../components/Input';
import {
  ConfigurationVariable,
  RemovedAssignment,
  RemovedAssignments,
  SingletonValue,
} from '../../../api/types/configurator';
import { VariableControlProps } from './proptypes';

function findRemoved(
  variable: ConfigurationVariable,
  removedAssignments?: RemovedAssignments
) {
  return removedAssignments?.variableAssignments?.find(
    (ra) => ra.variable?.id === variable.id
  );
}

/**
 * Collect and format a message for invalid assignments
 */
function getInvalidMessage(
  variable: ConfigurationVariable,
  removedAssignment: RemovedAssignment
) {
  const displayValues = formatAvailableValues(variable);

  return `${removedAssignment.value?.value} is not valid. Available values are [${displayValues}]`;
}

/**
 * `<TextInput>` component that knows about the data from the
 *  `/configure` API.
 */
function TextInput({
  variable,
  removedAssignments,
  onAssign,
  onUnassign,
}: VariableControlProps) {
  function handleOnChange(value: string) {
    value === ''
      ? onUnassign(variable)
      : onAssign(variable, {
          value,
        });
  }
  const assignedValue = getAssignedValue(variable)?.value || '';
  const removedAssignment = findRemoved(variable, removedAssignments);
  const message = removedAssignment
    ? getInvalidMessage(variable, removedAssignment)
    : null;
  const className = classnames('input', {
    'input-invalid': message,
  });
  const displayValue = removedAssignment
    ? removedAssignment.value
    : assignedValue;

  return (
    <div className="text-input">
      <Input
        className={className}
        type={variable.valueType === 'Number' ? 'number' : undefined}
        value={displayValue?.toString() || ''}
        onChange={handleOnChange}
      />
      <div className="text-input-help">{message}</div>
    </div>
  );
}

export default TextInput;
