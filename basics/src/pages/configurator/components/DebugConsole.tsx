import React, { useContext, useState } from 'react';
import tw from '../../../styles/classnames';
import { ConfiguratorContext } from '../ConfiguratorContext';
import { ReactComponent as DownIcon } from 'heroicons/solid/chevron-double-down.svg';
import { ReactComponent as TerminalIcon } from 'heroicons/solid/terminal.svg';
import {
  toUIAssignment,
  UIAssignment,
} from '../../../api/utils/assignment-utils';

export function DebugConsole() {
  const [isOpen, setIsOpen] = useState(false);
  const { assignments, configuration } = useContext(ConfiguratorContext);
  const totalPhases = configuration?.phaseCompletion?.totalPhases || 0;
  const cn = tw(
    'fixed',
    'border-t',
    'border-yellow-200',
    'bottom-0',
    'left-0',
    'bg-yellow-100',
    'px-2',
    'py-2',
    'flex',
    'flex-col',
    { 'h-64': isOpen, 'right-0': isOpen, 'w-screen': isOpen },
    { 'border-r': !isOpen }
  );

  const assignmentPanels = [
    {
      title: 'Assignments',
      assignments: assignments,
    },
  ];
  if (configuration?.removedAssignments?.variableAssignments?.length) {
    assignmentPanels.push({
      title: 'Removed Assignments',
      assignments: configuration?.removedAssignments?.variableAssignments.map(
        toUIAssignment
      ),
    });
  }

  return (
    <footer className={cn}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="focus:outline-none w-full text-yellow-800 font-semibold flex items-center"
      >
        <div className="text-yellow-800 font-semibold flex flex-1 items-center">
          <TerminalIcon height="1.25em" width="1.25em" />
          {isOpen ? <div className="pl-1">Debug Console</div> : null}
        </div>
        <div>{isOpen ? <DownIcon height="1.25em" width="1.25em" /> : null}</div>
      </button>
      {isOpen ? (
        <div className="flex-1 pb-2 w-full">
          <div className="flex gap-4 pb-2 h-48">
            {assignmentPanels.map((props) => (
              <AssignmentsPanel {...props} />
            ))}
          </div>
        </div>
      ) : null}
    </footer>
  );
}

type AssignmentsPanelProps = {
  title: string;
  assignments: UIAssignment[];
};

function AssignmentsPanel({ title, assignments }: AssignmentsPanelProps) {
  return (
    <div className="flex-1">
      <div className="text-gray-500">{title}</div>
      <ul className="list-disc whitespace-nowrap overflow-auto list-inside flex-1 h-full bg-gray-100 rounded border border-gray-300 px-4 py-2 shadow-inner">
        {assignments.map((a: UIAssignment) => (
          <li
            key={a.variable.id + `_` + a.value?.value + `_` + a.value?.excluded}
          >
            {a.variable.id} = {a.value?.value}
            {a.value?.excluded ? '(exclude)' : ''}
          </li>
        ))}
      </ul>
    </div>
  );
}
