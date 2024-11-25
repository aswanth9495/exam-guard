import React, { useState } from 'react';

import { ArrowRight } from 'lucide-react';
import { Button } from '@/ui/button';
import { Checkbox } from '@/ui/checkbox';
import { nextStep } from '@/store/features/workflowSlice';
import { useAppDispatch } from '@/hooks/reduxhooks';
import StepHeader from '@/ui/stepHeader';

const DesktopCameraStep = () => {
  const [isChecked, setIsChecked] = useState(false);
  const dispatch = useAppDispatch();

  return (
    <div className='p-8 flex-1 overflow-y-auto'>
      <StepHeader
        stepNumber='2'
        title='Desktop Camera Permissions'
        description='Select your desktop camera below, your camera feed will be continuously monitored throughout the test duration.'
      />
      {/* Add the UI Here */}
      <div className='mt-8'>
        <p className='text-gray-600 mt-8 text-xs italic text-xs'>
          Need help on sharing camera permissions?{' '}
          <a
            className='text-blue-600'
            href='https://support.google.com/chrome/answer/2693767?hl=en&co=GENIE.Platform%3DDesktop'
          >
            Click to view
          </a>{' '}
          setup guide
        </p>
        <div className='flex items-center gap-2 mt-6 text-xs'>
          <Checkbox
            id='confirm'
            checked={isChecked}
            onCheckedChange={(checked) => setIsChecked(checked as boolean)}
          />
          <label htmlFor='confirm' className='text-xs text-gray-600'>
            By clicking on this, you confirm that you have shared access to your
            camera and will be shared throughout the test.
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

export default DesktopCameraStep;
