import React from 'react';
// import React, { useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/ui/Button';
import { Checkbox } from '@/ui/Checkbox';
import { evaluateParentStepStatus } from '@/utils/evaluateParentStepStatus';
// import { selectProctor } from '@/store/features/assessmentInfoSlice';
import { selectStep, nextStep, setStepAcknowledged } from '@/store/features/workflowSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxhooks';
import StepHeader from '@/ui/StepHeader';
import SystemCheckCard from '@/ui/SystemCheckCard';

const SystemChecksStep = () => {
  const dispatch = useAppDispatch();
  // const proctor = useAppSelector((state) => selectProctor(state));
  const { acknowledged, subSteps } = useAppSelector((state) => (
    selectStep(state, 'compatibilityChecks')
  ));
  const { enableProctoring } = useAppSelector((state) => state.workflow);

  // useEffect(() => {
  //   if (proctor) {
  //     proctor?.handleCompatibilityChecks();
  //   }
  // }, [proctor]);

  const handleCheckboxChange = () => {
    dispatch(
      setStepAcknowledged({
        step: 'compatibilityChecks',
        acknowledged: !acknowledged,
      }),
    );
  };

  const areAllSubstepsCompleted = Object.values(subSteps)?.every(
    (substep) => substep.status === 'completed',
  );

  const status = evaluateParentStepStatus(Object.values(subSteps));

  const canProceed = acknowledged && areAllSubstepsCompleted;

  return (
    <div className='p-8 flex-1 overflow-y-auto'>
      <StepHeader
        stepNumber='4'
        title='System Compatibility Checks'
        description='Complete all system checks to ensure your assessment runs smoothly without interruptions'
        status={status}
      />
      <div className='mt-8'>
        <SystemCheckCard />
        {!enableProctoring && (
          <>
            <div className='flex items-start gap-2 mt-6 text-xs'>
              <Checkbox
                id='confirm'
                className='mt-2 mr-2'
                checked={acknowledged}
                onCheckedChange={handleCheckboxChange}
              />
              <label htmlFor='confirm' className='text-xs text-gray-600'>
                By clicking, you confirm that all your compatibility checks remains
                same. Failure to maintain proper setup may result in interruption.
              </label>
            </div>
            <Button
              className='mt-8 items-center'
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

export default SystemChecksStep;
