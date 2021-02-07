import React from 'react';
import { ReactComponent as ClearIcon } from 'heroicons/solid/x.svg';
import VariableInput from './VariableInput';
import {
  getAssignedValue,
  hasUserAssignedValue,
  isRequiredWithoutAssignment,
} from '../../../api/utils/variable-utils';
import {
  ConfigurationValue,
  ConfigurationVariable,
  SingletonValue,
} from '../../../api/types/configurator';
import { VariableControlProps } from './proptypes';

type UnassignButtonProps = {
  variable: ConfigurationVariable;
  onUnassign: (v: ConfigurationVariable, value?: SingletonValue) => void;
};

/**
 * Components that can render a "line" in the Configurator.
 * A line consist of
 *
 * * The variable name
 * * The Control for assigning values, e.g. <Dropdown>
 * * An Unassign button
 */

/**
 * Button for un assigning all values from a variables
 */
function UnassignButton({ variable, onUnassign }: UnassignButtonProps) {
  return (
    <button
      className="rounded-full focus:outline-none focus:ring text-gray-500"
      title={`Remove assignment to ${variable.name}`}
      onClick={() => onUnassign(variable)}
    >
      <ClearIcon width="20px" height="20px" />
    </button>
  );
}

type RequiredMarkProps = {
  variable: ConfigurationVariable;
};

/**
 * Render a (*)
 */
function RequiredMark({ variable }: RequiredMarkProps) {
  if (isRequiredWithoutAssignment(variable)) {
    return <strong title="Required">(*)</strong>;
  }
  return null;
}

type IssuesProps = {
  variable: ConfigurationVariable;
};

/**
 * Render any potential issues for a variable
 */
function Issues({ variable }: IssuesProps) {
  return variable.issues ? <div>!</div> : null;
}

type AssignedByMarkProps = {
  assignedValue?: ConfigurationValue;
};

const AssignedChars = {
  byRule: 'R',
  byUser: 'U',
  byDefault: 'D',
  byPhase: 'P',
};

const AssignedText = {
  byRule: 'Assigned by Rule',
  byUser: 'Assigned by User',
  byDefault: 'Assigned by Default',
  byPhase: 'Assigned by Phase',
};

function AssignedByMark({ assignedValue }: AssignedByMarkProps) {
  if (!assignedValue || !assignedValue.assigned) {
    return <div />;
  }
  return (
    <div
      title={AssignedText[assignedValue.assigned]}
      className="w-7 h-7 rounded-full align-center text-center text-white bg-green-600"
    >
      {AssignedChars[assignedValue.assigned]}
    </div>
  );
}
/**
 * `<VariableLine>` component renders
 *
 * * The variable name
 * * The Control for assigning values, e.g. <Dropdown>
 * * An Unassign button
 */
function VariableLine({
  variable,
  removedAssignments,
  onAssign,
  onUnassign,
}: VariableControlProps) {
  let className = 'flex w-full py-2 border-b items-start';
  if (variable.issues) {
    className += ' bg-red-100 rounded';
  }
  return (
    <div className={className}>
      <div className="w-1/3">
        {variable.name} <RequiredMark variable={variable} />
      </div>
      <div className="w-2/3 flex self-start">
        <div className="w-1/12">
          <AssignedByMark assignedValue={getAssignedValue(variable)} />
        </div>
        <div className="w-10/12">
          <VariableInput
            removedAssignments={removedAssignments}
            variable={variable}
            onAssign={onAssign}
            onUnassign={onUnassign}
          />
        </div>
        <div className="w-1/12 self-start">
          {hasUserAssignedValue(variable) && (
            <UnassignButton variable={variable} onUnassign={onUnassign} />
          )}
        </div>
      </div>
    </div>
  );
}

export default VariableLine;
