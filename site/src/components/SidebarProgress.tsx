import React from 'react';
import {useLmsConfig} from './useLmsConfig';
import {useLearningProgress} from './useLearningProgress';

/** Compact progress bar shown at the top of the docs sidebar. */
export default function SidebarProgress(): React.ReactElement | null {
  const lms = useLmsConfig();
  if (!lms) {
    return null;
  }

  const {isPageComplete, completionPercent, ready} = useLearningProgress(
    lms.courseId,
  );
  const percent = ready ? completionPercent(lms.trackablePageIds) : 0;
  const completedCount = ready
    ? lms.trackablePageIds.filter((id) => isPageComplete(id)).length
    : 0;

  return (
    <div className="cursor-sidebar-progress-bar" aria-live="polite">
      <div className="cursor-sidebar-progress-bar__header">
        <span className="cursor-sidebar-progress-bar__label">Course progress</span>
        <span className="cursor-sidebar-progress-bar__value">
          {ready ? `${completedCount}/${lms.trackablePageIds.length}` : '—'}
        </span>
      </div>
      <div
        className="cursor-sidebar-progress-bar__track"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}>
        <div
          className="cursor-sidebar-progress-bar__fill"
          style={{width: `${percent}%`}}
        />
      </div>
    </div>
  );
}
