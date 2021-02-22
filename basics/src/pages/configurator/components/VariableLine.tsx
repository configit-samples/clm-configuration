import React from 'react';
import { ReactComponent as ClearIcon } from 'heroicons/solid/x.svg';
import { ReactComponent as InfoIcon } from 'heroicons/outline/information-circle.svg';
import VariableInput from './VariableInput';
import {,
  hasUserAssignedValue,
  isRequiredWithoutAssignment,
} from '../../../api/utils/variable-utils';
import {
  ConfigurationValue,
  ConfigurationVariable,
} from '../../../api/types/configurator';
import { VariableControlProps } from './proptypes';
import { useConfigurator } from '../ConfiguratorContext';

type VariableButtonProps = {
  variable: ConfigurationVariable;
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
function UnassignButton({ variable }: VariableButtonProps) {
  const { unAssign } = useConfigurator();
  return (
    <button
      className="rounded-full focus:outline-none focus:ring text-gray-500"
      title={`Remove assignment to ${variable.name}`}
      onClick={() => unAssign(variable)}
    >
      <ClearIcon width="20px" height="20px" />
    </button>
  );
}

/**
 * Info button for un assigning all values from a variables
 */
function InfoButton({ variable }: VariableButtonProps) {
  return (
    <button
      className="rounded-full focus:outline-none focus:ring text-blue-800"
      title={`Information about ${variable.name}`}
    >
      <InfoIcon width="20px" height="20px" />
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
      <div className="w-5/12">
        {variable.name} <RequiredMark variable={variable} />
      </div>
      <div className="w-8 pt-1 text-center self-start">
        <InfoButton variable={variable} />
      </div>
      <div className="flex-1">
        <VariableInput
          removedAssignments={removedAssignments}
          variable={variable}
          onAssign={onAssign}
          onUnassign={onUnassign}
        />
      </div>
      <div className="w-8 self-start pt-1 text-center">
        {hasUserAssignedValue(variable) && (
          <UnassignButton variable={variable} />
        )}
      </div>
    </div>
  );
}

export default VariableLine;
