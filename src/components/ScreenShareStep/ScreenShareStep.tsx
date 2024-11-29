import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/ui/Button';
import { Checkbox } from '@/ui/Checkbox';
import { evaluateParentStepStatus } from '@/utils/evaluateParentStepStatus';
import { nextStep, setStepAcknowledged } from '@/store/features/workflowSlice';
import { SubStepState } from '@/types/workflowTypes';
import { selectStep } from '@/store/features/workflowSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxhooks';
import ScreenShareCard from '@/ui/ScreenShareCard';
import StepHeader from '@/ui/StepHeader';

const ScreenShareStep = () => {
  const dispatch = useAppDispatch();
  const { acknowledged, subSteps } = useAppSelector((state) =>
    selectStep(state, 'screenShare'),
  );
  const { enableProctoring } = useAppSelector((state) => state.workflow);

  const handleCheckboxChange = () => {
    dispatch(
      setStepAcknowledged({
        step: 'screenShare',
        acknowledged: !acknowledged,
      }),
    );
  };

  const areAllSubstepsCompleted = Object.values(subSteps).every(
    (subStep: SubStepState) => subStep.status === 'completed',
  );

  const status = evaluateParentStepStatus(Object.values(subSteps));

  const canProceed = acknowledged && areAllSubstepsCompleted;

  return (
    <div className='p-12 flex-1'>
      <StepHeader
        stepNumber='1'
        title='Test your Screen Share Permissions'
        description='Test if screen share permissions are enabled. If not, follow the instructions below to enable them'
        status={status}
      />
      <div className='mt-12'>
        <ScreenShareCard />
        <p className='text-gray-600 mt-12 italic text-xs'>
          <strong>Please Note :</strong> You will need to set up screen sharing
          again when your test begins, as the environment will refresh.
        </p>
        {!enableProctoring && (
          <>
            <div className='flex items-center gap-2 mt-8 text-xs'>
              <Checkbox
                id='confirm'
                checked={acknowledged}
                onCheckedChange={handleCheckboxChange}
              />
              <label htmlFor='confirm' className='text-xs text-gray-600'>
                By clicking on this, you confirm that you have shared your
                entire screen and will be shared throughout the test.
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
          </>
        )}
      </div>
    </div>
  );
};

export default ScreenShareStep;
