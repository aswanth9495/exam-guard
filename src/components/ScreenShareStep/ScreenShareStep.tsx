import React, { useMemo, useState } from 'react';
import { ArrowRight, Lightbulb } from 'lucide-react';

import { Button } from '@/ui/Button';
import { Checkbox } from '@/ui/Checkbox';
import { evaluateParentStepStatus } from '@/utils/evaluateParentStepStatus';
import { getBrowserInfo } from '@/utils/browser';
import { nextStep, setStepAcknowledged } from '@/store/features/workflowSlice';
import { SubStepState } from '@/types/workflowTypes';
import { selectProctor } from '@/store/features/assessmentInfoSlice';
import { selectStep, selectSubStep } from '@/store/features/workflowSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxhooks';
import GuideModal from '@/ui/GuideModal';
import ScreenShareCard from '@/ui/ScreenShareCard';
import ScreenShareGuide from '@/ui/ScreenShareGuide';
import StepHeader from '@/ui/StepHeader';

const ScreenShareStep = () => {
  const dispatch = useAppDispatch();
  const { acknowledged, subSteps } = useAppSelector((state) =>
    selectStep(state, 'screenShare'),
  );
  const { enableProctoring } = useAppSelector((state) => state.workflow);
  const proctor = useAppSelector(selectProctor);
  const screenShareState = useAppSelector((state) =>
    selectSubStep(state, 'screenShare', 'screenShare'),
  );
  
  const [showGuideModal, setShowGuideModal] = useState(false);

  const browserInfo: any = useMemo(() => getBrowserInfo(), []);

  const handleCheckboxChange = () => {
    dispatch(
      setStepAcknowledged({
        step: 'screenShare',
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
    <>
      <StepHeader
        stepNumber='1'
        title='Provide Screen Share Permissions'
        description='Please provide screen share permissions to continue, and ensure that it remains enabled throughout the test.'
        status={status}
      />
      <div className='mt-16'>
        <ScreenShareCard />
        <p className='mt-12 text-sm text-black font-semibold text-center'>
          <Lightbulb className='mb-1 w-6 h-6 inline-block mr-2 text-black font-bold' />
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
              className='mr-2 h-5 w-5'
              checked={acknowledged}
              onCheckedChange={handleCheckboxChange}
            />
            <label htmlFor='confirm' className='text-xs text-gray-600'>
              By clicking on this, you confirm that you have shared your entire
              screen and will be shared throughout the test.
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
          isError={screenShareState.status === 'error'}
          title="It looks like you're having trouble allowing Screen Sharing Permissions"
        >
          <div className='space-y-6'>
            <p className='text-muted-foreground text-sm'>
              Refer to the guide below for steps to troubleshoot and grant screen
              sharing permissions
            </p>
            <div className='aspect-[16/9] w-full bg-muted rounded-lg overflow-y-auto p-8 shadow-sm'>
              <ScreenShareGuide browserName={browserInfo?.name} />
            </div>
          </div>
        </GuideModal>
      </div>
    </>
  );
};

export default ScreenShareStep;
