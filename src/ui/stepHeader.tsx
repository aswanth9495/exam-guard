import React from 'react';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import Loader from '@/ui/loader';
import { Status } from '@/types/globals';

const StepHeader = ({
  stepNumber,
  title,
  description,
  status,
}: {
  stepNumber: string;
  title: string;
  description: string;
  status: Status;
}) => (
  <div className='flex items-center gap-4'>
    {status === 'completed' ? (
      <CheckCircle className='text-green-500 w-16 h-16' />
    ) : status === 'error' ? (
      <AlertTriangle className='text-red-500 w-16 h-16' />
    ) : (
      <Loader size='md' />
    )}
    <div>
      <div className='text-xs text-gray-400'>STEP {stepNumber}</div>
      <h2 className='text-2xl font-bold mt-2'>{title}</h2>
      <p className='text-sm text-gray-600 italic mt-2'>{description}</p>
    </div>
  </div>
);

export default StepHeader;
