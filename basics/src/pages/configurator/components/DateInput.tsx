import React, { AllHTMLAttributes, ChangeEvent, KeyboardEvent } from 'react';
import classnames from 'classnames';
import './DateInput.css';
import {
  getAssignedValue,
  formatAvailableValues,
} from '../../../api/utils/variable-utils';
import {
  ConfigurationVariable,
  RemovedAssignment,
  RemovedAssignments,
} from '../../../api/types/configurator';
import { VariableControlProps } from './proptypes';

const with2Digits = (v: number) => ('0' + v).slice(-2);

/**
 * Helper to format a date so it can be passed to the date input
 */
const formatDateForInput = (value: Date) => {
  const d = new Date(value);
  return `${d.getFullYear()}-${with2Digits(d.getMonth() + 1)}-${with2Digits(
    d.getDate()
  )}`;
};

const formatDateForDisplay = (value: string) => {
  const d = new Date(value);
  return `${with2Digits(d.getDate())}/${with2Digits(
    d.getMonth() + 1
  )}/${d.getFullYear()}`;
};

function isValidDate(d: Date) {
  return !isNaN(d.getTime());
}

type DatePickerProps = {
  onChange: (value?: string) => void;
  value: string;
} & Omit<AllHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'>;

function DatePicker(props: DatePickerProps) {
  function handleOnChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;

    props.onChange(value ? new Date(value).toISOString() : undefined);
  }

  function handleOnKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    const relevantKey = e.altKey || e.key === 'Tab' || e.key === 'Escape';
    if (!relevantKey) {
      e.preventDefault();
    }
  }

  const { value, ...inputProps } = props;

  const date = new Date(value);
  const dateValue = isValidDate(date) ? formatDateForInput(date) : '';
  return (
    <input
      {...inputProps}
      type="date"
      value={dateValue}
      onChange={handleOnChange}
      onKeyDown={handleOnKeyDown}
    />
  );
}

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
  const displayValues = formatAvailableValues(
    variable,
    10,
    ',',
    formatDateForDisplay
  );

  return `${formatDateForDisplay(
    removedAssignment.value?.value?.toString() || ''
  )} is not valid. Available values are [${displayValues}]`;
}

/**
 * `<DateInput>` component that knows about the data from the
 *  `/configure` API.
 */
function DateInput({
  variable,
  onAssign,
  onUnassign,
  removedAssignments,
}: VariableControlProps) {
  function handleOnChange(value?: string) {
    value ? onAssign(variable, { value }) : onUnassign(variable);
  }

  const assignedValue = (getAssignedValue(variable) || { value: '' }).value;

  const removedAssignment = findRemoved(variable, removedAssignments);
  const message = removedAssignment
    ? getInvalidMessage(variable, removedAssignment)
    : null;
  const className = classnames('input', {
    'input-invalid': message,
  });

  let displayValue = removedAssignment
    ? removedAssignment.value?.value?.toString()
    : assignedValue?.toString();

  return (
    <div className="date-input">
      <DatePicker
        className={className}
        type="date"
        value={displayValue || ''}
        onChange={handleOnChange}
      />
      <div className="date-input-help">{message}</div>
    </div>
  );
}

export default DateInput;
