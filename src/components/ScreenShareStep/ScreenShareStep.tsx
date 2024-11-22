import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/ui/Button';
import { Checkbox } from '@/ui/Checkbox';
import { nextStep } from '@/store/features/workflowSlice';
import { useAppDispatch } from '@/hooks/reduxhooks';
import CompatibilityCard from '@/ui/CompatibilityCard';
import StepHeader from '@/ui/StepHeader';

const ScreenShareStep = () => {
  const [isChecked, setIsChecked] = useState(false);
  const dispatch = useAppDispatch();

  return (
    <div className='p-8 flex-1'>
      <StepHeader
        stepNumber='1'
        title='Test your Screen Share Permissions'
        description='Test if screen share permissions are enabled. If not, follow the instructions below to enable them'
      />
      <div className='mt-8'>
        <CompatibilityCard />
        <p className='text-gray-600 mt-8 text-xs italic text-sm'>
          <strong>Please Note :</strong> You will need to set up screen sharing
          again when your test begins, as the environment will refresh.
        </p>
        <div className='flex items-center gap-2 mt-6 text-sm'>
          <Checkbox
            id='confirm'
            checked={isChecked}
            onCheckedChange={(checked) => setIsChecked(checked as boolean)}
          />
          <label htmlFor='confirm' className='text-xs text-gray-600'>
            By clicking on this, you confirm that you have shared your entire
            screen and will be shared throughout the test.
          </label>
        </div>
        <Button
          className='mt-8'
          variant='primary'
          disabled={!isChecked}
          onClick={() => dispatch(nextStep())}
        >
          Proceed to next step
          <ArrowRight className='w-4 h-4' />
        </Button>
      </div>
    </div>
  );
};

export default ScreenShareStep;
