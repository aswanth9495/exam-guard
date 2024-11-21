import React from 'react';

const StepLoader = ({
  text,
  isLoading,
}: {
  text: string;
  isLoading: boolean;
}) => (
  <div className='mt-8 bg-slate-900 text-white p-6 rounded-lg'>
    <div className='flex items-center gap-3'>
      <div className='animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent' />
      {text}
    </div>
  </div>
);

export default StepLoader;
