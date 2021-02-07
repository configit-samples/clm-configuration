import React from 'react';
import { Dialog } from '@reach/dialog';
import '@reach/dialog/styles.css';

import { RemovedAssignment } from '../../../api/types/configurator';
import { UIAssignment, UIConflict } from '../../../api/utils/assignment-utils';

/**
 * Format the variable name from an assignment
 */
function FormatVariable({
  assignment,
}: {
  assignment: RemovedAssignment | UIAssignment;
}) {
  return <strong>{assignment.variable?.name}</strong>;
}

/**
 * Format the value of an assignment
 */
function FormatValue({ assignment }: { assignment: RemovedAssignment }) {
  const value = assignment?.value?.value || '';

  if (assignment?.variable?.valueType === 'Boolean') {
    return <strong>{assignment.value?.value ? 'True' : 'False'}</strong>;
  }
  if (assignment?.variable?.valueType === 'Date') {
    return <strong>{new Date(value).toLocaleDateString()}</strong>;
  }
  if (assignment?.variable?.valueType === 'Number') {
    return <strong>{value}</strong>;
  }
  return <strong>{assignment?.value?.name || value}</strong>;
}

/**
 * Format a multi-valued assignment
 */
function FormatMultiAssignment({
  assignment,
  separator,
}: {
  assignment: RemovedAssignment;
  separator: string;
}) {
  return (
    <>
      <strong>{assignment?.value?.exclude ? 'No' : 'Yes'}</strong> {separator}{' '}
      <FormatValue assignment={assignment} /> In{' '}
      <FormatVariable assignment={assignment} />
    </>
  );
}

/**
 * Format any assignment, using a separator between variable and value.
 */
function FormatAssignment({
  assignment,
  separator,
}: {
  assignment: RemovedAssignment;
  separator: string;
}) {
  if (assignment.variable?.allowMultipleAssignments) {
    return (
      <FormatMultiAssignment assignment={assignment} separator={separator} />
    );
  }
  return (
    <>
      <FormatValue assignment={assignment} /> {separator}{' '}
      <FormatVariable assignment={assignment} />
    </>
  );
}

type ConflictDialogProps = {
  conflict?: UIConflict;
  onAccept: () => void;
  onReject: () => void;
};

/**
 * Display a dialog from the `conflict`
 *
 * * Call `onAccept` when the user accepts the conflict.
 * * Call `onReject` when the user rejects the conflict.
 */
function ConflictDialog({ conflict, onAccept, onReject }: ConflictDialogProps) {
  const currentAssignment = (conflict || {}).currentAssignment;
  const removedAssignments = (conflict || {}).removedAssignments;

  return (
    <Dialog
      aria-label="Conflict Dialog"
      onDismiss={onReject}
      isOpen={!!conflict}
    >
      <div>
        <div>
          <h1>Assign and remove?</h1>
          {currentAssignment && (
            <>
              <div>Assigning</div>
              <ul>
                <li>
                  <FormatAssignment
                    assignment={currentAssignment}
                    separator="To"
                  />
                </li>
              </ul>
              <div>Removes</div>
              <ul>
                {removedAssignments?.map((ra) => (
                  <li key={ra.variable?.id}>
                    <FormatAssignment assignment={ra} separator="From" />
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
        <div>
          <button className="btn btn-primary" onClick={onAccept}>
            Assign and remove
          </button>
          &nbsp;&nbsp;
          <button className="btn btn-secondary" onClick={onReject}>
            Cancel
          </button>
        </div>
      </div>
    </Dialog>
  );
}

export default ConflictDialog;
