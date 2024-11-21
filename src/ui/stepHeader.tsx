import React from 'react';

const StepHeader = ({
  stepNumber,
  title,
  description,
}: {
  stepNumber: string;
  title: string;
  description: string;
}) => (
  <div>
    <div className='text-sm text-gray-400'>STEP {stepNumber}</div>
    <h2 className='text-2xl font-bold mt-2'>{title}</h2>
    <p className='text-sm text-gray-600 italic mt-2'>{description}</p>
  </div>
);

export default StepHeader;
