import React from 'react';

import { ArrowRight } from 'lucide-react';
import { Button } from '@/ui/Button';
import { Checkbox } from '@/ui/Checkbox';
import { evaluateParentStepStatus } from '@/utils/evaluateParentStepStatus';
import { nextStep, setStepAcknowledged } from '@/store/features/workflowSlice';
import { selectProctor } from '@/store/features/assessmentInfoSlice';
import { selectStep } from '@/store/features/workflowSlice';
import { SubStepState } from '@/types/workflowTypes';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxhooks';
import CameraCard from '@/ui/CameraCard';
import StepHeader from '@/ui/StepHeader';

const DesktopCameraStep = () => {
  const dispatch = useAppDispatch();
  const { acknowledged, subSteps } = useAppSelector((state) =>
    selectStep(state, 'cameraShare'),
  );
  const proctor = useAppSelector(selectProctor);
  const { enableProctoring } = useAppSelector((state) => state.workflow);

  const handleCheckboxChange = () => {
    dispatch(
      setStepAcknowledged({
        step: 'cameraShare',
        acknowledged: !acknowledged,
      }),
    );
  };

  const handleClick = () => {
    if (enableProctoring) {
      proctor?.handleCompatibilityChecks({ forceRun: true });
    } else {
      dispatch(nextStep());
    }
  };

  const areAllSubstepsCompleted = Object.values(subSteps).every(
    (subStep: SubStepState) => subStep.status === 'completed',
  );

  const status = evaluateParentStepStatus(Object.values(subSteps));

  const canProceed = enableProctoring || (acknowledged && areAllSubstepsCompleted);

  return (
    <div className='p-20 pt-12 flex-1 overflow-y-auto'>
      <StepHeader
        stepNumber='2'
        title='Desktop Camera Permissions'
        description='Test if camera permissions are enabled. If not, follow the instructions below to enable them'
        status={status}
      />
      <div className='mt-16'>
        <CameraCard />
        {!enableProctoring && (
          <div className='flex items-center gap-2 mt-16 text-xs'>
            <Checkbox
              id='confirm'
              className='mt-1 mr-2 h-5 w-5'
              checked={acknowledged}
              onCheckedChange={handleCheckboxChange}
            />
            <label htmlFor='confirm' className='text-xs text-gray-600'>
              By clicking on this, you confirm that you have enabled camera
              access and it will remain enabled throughout the test.
            </label>
          </div>
        )}
        <Button
          className='mt-8 items-center py-8 px-10'
          variant='primary'
          disabled={!canProceed}
          onClick={handleClick}
        >
          {enableProctoring ? 'Confirm Settings' : (
            <>
              Proceed to next step
              <ArrowRight className='w-6 h-6' />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default DesktopCameraStep;
