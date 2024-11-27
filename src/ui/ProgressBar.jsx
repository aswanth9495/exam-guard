import React from 'react';
import classNames from 'classnames';

const ProgressBar = ({ progress = 50, className }) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={classNames(
      'w-full h-4 bg-gray-200 rounded-full overflow-hidden',
      { [className]: className },
    )}>
      <div
        className="h-full bg-green-500 transition-all duration-300 ease-in-out"
        style={{ width: `${clampedProgress}%` }}
      />
    </div>
  );
};

export default ProgressBar;
