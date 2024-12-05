import React, { useState } from 'react';

import { ArrowRight, Lightbulb } from 'lucide-react';
import { Button } from '@/ui/Button';
import { Checkbox } from '@/ui/Checkbox';
import { evaluateParentStepStatus } from '@/utils/evaluateParentStepStatus';
import { nextStep, setStepAcknowledged, selectSubStep, selectStep } from '@/store/features/workflowSlice';
import { selectProctor } from '@/store/features/assessmentInfoSlice';
import { SubStepState } from '@/types/workflowTypes';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxhooks';
import CameraCard from '@/ui/CameraCard';
import StepHeader from '@/ui/StepHeader';
import GuideModal from '@/ui/GuideModal';

const DesktopCameraStep = () => {
  const dispatch = useAppDispatch();
  const { acknowledged, subSteps } = useAppSelector((state) =>
    selectStep(state, 'cameraShare'),
  );
  const proctor = useAppSelector(selectProctor);
  const { enableProctoring } = useAppSelector((state) => state.workflow);

  const cameraState = useAppSelector((state) =>
    selectSubStep(state, 'cameraShare', 'cameraShare'),
  );

  const [showGuideModal, setShowGuideModal] = useState(false);

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
      proctor?.handleWebcamRequest();
      dispatch(nextStep());
    }
  };

  const areAllSubstepsCompleted = Object.values(subSteps).every(
    (subStep: SubStepState) => subStep.status === 'completed',
  );

  const status = evaluateParentStepStatus(Object.values(subSteps));

  const canProceed = enableProctoring || (acknowledged && areAllSubstepsCompleted);

  return (
    <>
      <StepHeader
        stepNumber='2'
        title='Desktop/Laptop Camera Permissions'
        description='Please provide camera permissions to continue, and ensure that it remains enabled throughout the test.'
        status={status}
      />
      <div className='mt-16'>
        <CameraCard />

        <p className='mt-12 text-sm text-black font-semibold text-center'>
          <Lightbulb className='w-6 h-6 inline-block mr-2 text-black font-bold' />
              Need help?{' '}
              <a
                href='#'
                onClick={(e) => {
                  e.preventDefault();
                  setShowGuideModal(true);
                }}
                className='text-blue-500 underline'
              >
                Click to view
              </a>{' '}
              screen sharing setup guide
        </p>
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

      <GuideModal
        open={showGuideModal}
        onOpenChange={setShowGuideModal}
        isError={cameraState.status === 'error'}
        title="It looks like you're having trouble accessing your camera"
      >
        <div className='space-y-6'>
          <p className='text-muted-foreground'>
            Refer to the image below for steps to troubleshoot and grant camera
            permissions
          </p>
          <div className='aspect-[16/9] w-full bg-muted rounded-lg'>
            {/*  */}
          </div>
          <p className='text-sm italic'>
            Need help on sharing camera permissions?{' '}
            <a href='#' className='text-blue-500 hover:underline'>
              Click to view
            </a>{' '}
            setup guide
          </p>
        </div>
      </GuideModal>
      </div>
    </>
  );
};

export default DesktopCameraStep;
