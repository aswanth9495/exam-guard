import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/ui/button';
import { Checkbox } from '@/ui/checkbox';
import { nextStep, acknowledgeStep } from '@/store/features/workflowSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxhooks';
import CompatibilityCard from '@/ui/compatibilityCard';
import StepHeader from '@/ui/stepHeader';

const ScreenShareStep = () => {
  const dispatch = useAppDispatch();
  const acknowledged = useAppSelector(
    (state) => state.workflow.steps['1'].acknowledged
  );

  const handleCheckboxChange = () => {
    dispatch(acknowledgeStep('1'));
  };

  return (
    <div className='p-12 flex-1'>
      <StepHeader
        stepNumber='1'
        title='Test your Screen Share Permissions'
        description='Test if screen share permissions are enabled. If not, follow the instructions below to enable them'
      />
      <div className='mt-12'>
        <CompatibilityCard />
        <p className='text-gray-600 mt-12 italic text-xs'>
          <strong>Please Note :</strong> You will need to set up screen sharing
          again when your test begins, as the environment will refresh.
        </p>
        <div className='flex items-center gap-2 mt-8 text-xs'>
          <Checkbox
            id='confirm'
            checked={acknowledged}
            onCheckedChange={handleCheckboxChange}
          />
          <label htmlFor='confirm' className='text-xs text-gray-600'>
            By clicking on this, you confirm that you have shared your entire
            screen and will be shared throughout the test.
          </label>
        </div>
        <Button
          className='mt-12 items-center'
          variant='primary'
          disabled={!acknowledged}
          onClick={() => dispatch(nextStep())}
        >
          Proceed to next step
          <ArrowRight className='w-6 h-6' />
        </Button>
      </div>
    </div>
  );
};

export default ScreenShareStep;
