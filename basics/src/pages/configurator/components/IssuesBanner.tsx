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
export default function IssueBanner({ issues }: InvalidMarkPropTypes) {
  const [showDialog, setShowDialog] = useState(false);

  if (!issues) {
    return null;
  }

  return (
    <div className="absolute bottom-0 left-0 w-screen p-4 text-yellow-900 font-semibold bg-yellow-100 border-t border-yellow-200 shadow-sm">
      {issues.length === 1 ? ' 1 issue' : ` ${issues.length} issues`}
      <IssuesDialog
        issues={issues}
        isOpen={showDialog}
        onDismiss={() => setShowDialog(false)}
      />
    </div>
  );
}

export function ConflictBanner() {
  return (
    <div className="absolute bottom-0 left-0 w-screen p-4 text-yellow-900 font-semibold bg-yellow-100 border-t border-yellow-200 shadow-sm">
      <div className="flex">
        <div className="flex-1">Previous choices removed</div>
        <div>
          Choosing <strong>Sports Pack</strong> removed{' '}
          <span className="underline">3 previous choices</span>
          {' | '}
          <span className="underline">Undo</span>
        </div>
      </div>
    </div>
  );
}
