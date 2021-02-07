import React from 'react';
import classnames from 'classnames';
import { VariableControlProps } from './proptypes';
import { SingletonValue, ValueState } from '../../../api/types/configurator';
import tw from '../../../styles/classnames';
import * as utils from '../../../api/utils';

type MultivaluedOptionProps = {
  value: SingletonValue;
  exclude: boolean;
} & MultivaluedInputProps;

/**
 * A single radio button in a `<MultivaluedOptions>` component.
 */
function MultivaluedOption({
  variable,
  value,
  exclude,
  onAssign,
  onUnassign,
}: MultivaluedOptionProps) {
  function assigned(value: SingletonValue, exclude: boolean) {
    return value && (exclude ? value.excluded?.assigned : value.assigned);
  }

  function incompatible(value: SingletonValue, exclude: boolean) {
    return (
      value && (exclude ? value.excluded?.incompatible : value.incompatible)
    );
  }

  function handleOnChange() {
    const excluded: ValueState | undefined = exclude
      ? { assigned: 'byUser' }
      : undefined;

    if (assigned(value, exclude) === 'byUser') {
      onUnassign(variable, { value: value.value, excluded });
    } else {
      onAssign(variable, {
        value: value.value,
        excluded,
      });
    }
  }

  const className = tw('pr-4', 'flex', 'items-center', {
    'line-through': incompatible(value, exclude),
  });
  const checked = !!assigned(value, exclude);

  const valueString = value.value?.toString() || '';

  return (
    <label className={className}>
      <input
        type="radio"
        name={valueString}
        checked={checked}
        id={valueString + exclude}
        onClick={handleOnChange}
        onChange={() => {}}
        value={valueString}
      />
      <span className="pl-1">{exclude ? 'No' : 'Yes'}</span>
    </label>
  );
}
type MultivaluedValueProps = Omit<
  VariableControlProps,
  'removedAssignments'
> & {
  value: SingletonValue;
};

function MultivaluedValue({
  value,
  variable,
  onAssign,
  onUnassign,
}: MultivaluedValueProps) {
  if (value.assigned === 'byPhase') {
    return (
      <MultivaluedOption
        variable={variable}
        value={value}
        onAssign={onAssign}
        onUnassign={onUnassign}
        exclude={false}
        key="yes"
      />
    );
  }
  if (value.excluded?.assigned === 'byPhase') {
    return (
      <MultivaluedOption
        variable={variable}
        value={value}
        onAssign={onAssign}
        onUnassign={onUnassign}
        exclude={true}
        key="no"
      />
    );
  }
  return (
    <div className="flex">
      <MultivaluedOption
        variable={variable}
        value={value}
        onAssign={onAssign}
        onUnassign={onUnassign}
        exclude={false}
        key="yes"
      />

      <MultivaluedOption
        variable={variable}
        value={value}
        onAssign={onAssign}
        onUnassign={onUnassign}
        exclude={true}
        key="no"
      />
    </div>
  );
}

type MultivaluedInputProps = Omit<VariableControlProps, 'removedAssignments'>;

/**
 * `<MultivalueInput>` component is used to render multiple assignable values
 * for variables that accepts multiple assignments.
 *
 * Each a value can be "included/excluded" and each option is being renders as
 * a radiobutton.
 */
function MultivaluedInput({
  variable,
  onAssign,
  onUnassign,
}: MultivaluedInputProps) {
  const values: SingletonValue[] =
    (!variable.distinctValueCount
      ? [...(variable.values?.slice(1) || [])]
      : variable.values) || [];

  return (
    <div className="flex flex-col gap-4">
      {values.map((value) => (
        <div key={value.value?.toString()}>
          <div className="text-gray-700 font-semibold">{value.name}</div>
          <div>
            <MultivaluedValue
              variable={variable}
              value={value}
              onAssign={onAssign}
              onUnassign={onUnassign}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default MultivaluedInput;
