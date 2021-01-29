import React, { useState } from 'react';
import IssuesDialog from './IssuesDialog';
import { Issue } from '../../../api/types/configurator';

type InvalidMarkPropTypes = {
  issues?: Issue[];
};

/**
 * Display invalid mark if the `issues` props is set.
 *
 * When the invalid mark is clicked render a dialog that display the issues.
 */
export default function InvalidMark({ issues }: InvalidMarkPropTypes) {
  const [showDialog, setShowDialog] = useState(false);

  if (!issues) {
    return null;
  }

  return (
    <>
      <button
        className="btn bg-red-500 hover:bg-red-700"
        onClick={() => setShowDialog(!showDialog)}
      >
        Invalid ({issues.length === 1 ? '1 issue' : `${issues.length} issues`})
      </button>
      <IssuesDialog
        issues={issues}
        isOpen={showDialog}
        onDismiss={() => setShowDialog(false)}
      />
    </>
  );
}
