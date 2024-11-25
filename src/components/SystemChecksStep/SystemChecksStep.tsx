import React, { useState } from 'react';

import { ArrowRight } from 'lucide-react';
import { Button } from '@/ui/button';
import { Checkbox } from '@/ui/checkbox';
import { nextStep } from '@/store/features/workflowSlice';
import { useAppDispatch } from '@/hooks/reduxhooks';
import StepHeader from '@/ui/stepHeader';

const SystemChecksStep = () => {
  const [isChecked, setIsChecked] = useState(false);
  const dispatch = useAppDispatch();

  return (
    <div className='p-8 flex-1'>
      <StepHeader
        stepNumber='4'
        title='System Compatibility Checks'
        description='Complete all system checks to ensure your assessment runs smoothly without interruptions'
      />
      <div className='mt-8'>
        <div className='flex items-center gap-2 mt-6 text-xs'>
          <Checkbox
            id='confirm'
            checked={isChecked}
            onCheckedChange={(checked) => setIsChecked(checked as boolean)}
          />
          <label htmlFor='confirm' className='text-xs text-gray-600'>
            By clicking, you confirm that all your compatibility checks remains
            same. Failure to maintain proper setup may result in interruption.
          </label>
        </div>
        <Button
          className='mt-8 items-center'
          variant='primary'
          disabled={!isChecked}
          onClick={() => dispatch(nextStep())}
        >
          Proceed to next step
          <ArrowRight className='w-6 h-6' />
        </Button>
      </div>
    </div>
  );
};

export default SystemChecksStep;
