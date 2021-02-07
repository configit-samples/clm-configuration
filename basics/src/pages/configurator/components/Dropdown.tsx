import React, { ChangeEvent } from 'react';
import classnames from 'classnames';
import {
  getAssignedValue,
  hasSystemAssignedValue,
} from '../../../api/utils/variable-utils';
import {
  SingletonValue,
  isSingletonValue,
} from '../../../api/types/configurator';
import { VariableControlProps } from './proptypes';

const NO_VALUE_VALUE = 'NO_VALUE';
const NO_VALUE = { value: NO_VALUE_VALUE };

type OptionProps = {
  value: SingletonValue;
};

/**
 * Single option in a `<Dropdown>`.
 */
function Option({ value }: OptionProps) {
  const { name } = value;

  const className = classnames({
    'text-gray-400 line-through': value.incompatible,
  });

  return (
    <option className={className} value={value.value?.toString()}>
      {name}
    </option>
  );
}

type DropDownProps = Omit<VariableControlProps, 'removedAssignments'>;

/**
 * A `<Dropdown>` component that knows about the data from
 * the `/configure` API
 */
export default function Dropdown({
  variable,
  onAssign,
  onUnassign,
}: DropDownProps) {
  /**
   * When an option is selected in the `<Dropdown>` this handler function
   * is called. If the option is the empty option we call `onUnassign` otherwise
   * we call `onAssign` with the selected option value
   */
  function handleOnChange(e: ChangeEvent<HTMLSelectElement>) {
    const { value } = e.target;

    const selectedValue = variable.values?.find(
      (v) => isSingletonValue(v) && v.value?.toString() === value
    ) as SingletonValue;

    value === NO_VALUE_VALUE
      ? onUnassign(variable)
      : onAssign(variable, selectedValue);
  }

  const assignedValue = getAssignedValue(variable) || NO_VALUE;

  return (
    <select
      className="input w-full"
      value={assignedValue.value?.toString()}
      onChange={handleOnChange}
    >
      {!hasSystemAssignedValue(variable) && (
        <option key={NO_VALUE_VALUE} value={NO_VALUE_VALUE} />
      )}
      {variable.values?.map((value, i) => (
        <Option
          key={`${isSingletonValue(value) ? value.value : ''}-${i}`}
          value={value}
        />
      ))}
    </select>
  );
}
