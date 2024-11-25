import React from 'react';

import { ArrowRight } from 'lucide-react';
import { Button } from '@/ui/Button';
import { Checkbox } from '@/ui/Checkbox';
import { nextStep, setStepAcknowledged } from '@/store/features/workflowSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxhooks';
import { selectStep } from '@/store/features/workflowSlice';
import StepHeader from '@/ui/StepHeader';
import CameraCard from '@/ui/CameraCard';

const DesktopCameraStep = () => {
  const dispatch = useAppDispatch();
  const { acknowledged, status } = useAppSelector((state) =>
    selectStep(state, 'cameraShare')
  );

  const handleCheckboxChange = () => {
    dispatch(
      setStepAcknowledged({
        step: 'cameraShare',
        acknowledged: !acknowledged,
      })
    );
  };

  const canProceed = acknowledged && status === 'completed';

  return (
    <div className='p-12 flex-1'>
      <StepHeader
        stepNumber='2'
        title='Desktop Camera Permissions'
        status={status}
      />
      <div className='mt-12'>
        <CameraCard />
        <div className='flex items-center gap-2 mt-8 text-xs'>
          <Checkbox
            id='confirm'
            checked={acknowledged}
            onCheckedChange={handleCheckboxChange}
          />
          <label htmlFor='confirm' className='text-xs text-gray-600'>
            By clicking on this, you confirm that you have enabled camera access
            and it will remain enabled throughout the test.
          </label>
        </div>
        <Button
          className='mt-12 items-center'
          variant='primary'
          disabled={!canProceed}
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
