import React, { useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/ui/Button';
import { Checkbox } from '@/ui/Checkbox';
import { evaluateParentStepStatus } from '@/utils/evaluateParentStepStatus';
import { selectProctor } from '@/store/features/assessmentInfoSlice';
import { selectStep, nextStep, setStepAcknowledged } from '@/store/features/workflowSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxhooks';
import StepHeader from '@/ui/StepHeader';
import SystemCheckCard from '@/ui/SystemCheckCard';

const SystemChecksStep = () => {
  const dispatch = useAppDispatch();
  const proctor = useAppSelector((state) => selectProctor(state));
  const { acknowledged, subSteps } = useAppSelector((state) => (
    selectStep(state, 'compatibilityChecks')
  ));
  const { enableProctoring } = useAppSelector((state) => state.workflow);

  useEffect(() => {
    if (proctor) {
      proctor?.handleCompatibilityChecks();
    }
  }, [proctor]);

  const handleCheckboxChange = () => {
    dispatch(
      setStepAcknowledged({
        step: 'compatibilityChecks',
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

  const areAllSubstepsCompleted = Object.values(subSteps)?.every(
    (substep) => substep.status === 'completed',
  );

  const status = evaluateParentStepStatus(Object.values(subSteps));

  const canProceed = enableProctoring || (acknowledged && areAllSubstepsCompleted);

  return (
    <>
      <StepHeader
        stepNumber='4'
        title='System Compatibility Checks'
        description='Complete all system checks to ensure your assessment runs smoothly without interruptions'
        status={status}
      />
      <div className='mt-16'>
        <SystemCheckCard />
        {!enableProctoring && (
          <div className='flex items-center gap-2 mt-16 text-xs'>
            <Checkbox
              id='confirm'
              className='mr-2 h-5 w-5'
              checked={acknowledged}
              onCheckedChange={handleCheckboxChange}
            />
            <label htmlFor='confirm' className='text-xs text-gray-600'>
              By clicking, you confirm that all your compatibility checks
              remains same. Failure to maintain proper setup may result in
              interruption.
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
    </>
  );
};

export default SystemChecksStep;
