import React from 'react';
import Button from '../../../components/Button';
import { Dialog } from '@reach/dialog';
import '@reach/dialog/styles.css';
import './ConflictDialog.css';

/**
 * Format the variable name from an assignment
 */
const FormatVariable = ({ assignment }) => (
  <strong>{assignment.variable.name}</strong>
);

/**
 * Format the value of an assignment
 */
const FormatValue = ({ assignment }) => {
  if (assignment.variable.valueType === 'Boolean') {
    return <strong>{assignment.value.value ? 'True' : 'False'}</strong>;
  }
  if (assignment.variable.valueType === 'Date') {
    return (
      <strong>{new Date(assignment.value.value).toLocaleDateString()}</strong>
    );
  }
  if (assignment.variable.valueType === 'Number') {
    return <strong>{assignment.value.value}</strong>;
  }
  return <strong>{assignment.value.name || assignment.value.value}</strong>;
};

/**
 * Format a multi-valued assignment
 */
const FormatMultiAssignment = ({ assignment, separator }) => (
  <>
    <strong>{assignment.value.exclude ? 'No' : 'Yes'}</strong> {separator}{' '}
    <FormatValue assignment={assignment} /> In{' '}
    <FormatVariable assignment={assignment} />
  </>
);

/**
 * Format any assignment, using a separator between variable and value.
 */
const FormatAssignment = ({ assignment, separator }) => {
  if (assignment.variable.allowMultipleAssignments) {
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
};

/**
 * Display a dialog from the `conflict`
 *
 * * Call `onAccept` when the user accepts the conflict.
 * * Call `onReject` when the user rejects the conflict.
 */
function ConflictDialog({ conflict, onAccept, onReject }) {
  const currentAssignment = (conflict || {}).currentAssignment;
  const removedAssignments = (conflict || {}).removedAssignments;

  return (
    <Dialog
      aria-label="Conflict Dialog"
      onDismiss={onReject}
      isOpen={!!conflict}
    >
      <div className="conflict">
        <div className="conflict-content">
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
                {removedAssignments.map((ra) => (
                  <li key={ra.variable.id}>
                    <FormatAssignment assignment={ra} separator="From" />
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
        <div className="conflict-footer">
          <Button onClick={onAccept}>Assign and remove</Button>
          &nbsp;&nbsp;
          <Button variant="link" onClick={onReject}>
            Cancel
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

export default ConflictDialog;
