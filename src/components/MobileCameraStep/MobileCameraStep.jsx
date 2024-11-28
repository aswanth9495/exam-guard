import React from 'react';

import { ArrowRight } from 'lucide-react';
import { Button } from '@/ui/Button';
import { Checkbox } from '@/ui/Checkbox';
import { evaluateParentStepStatus } from '@/utils/evaluateParentStepStatus';
import { nextStep, selectStep, setStepAcknowledged } from '@/store/features/workflowSlice';
import { PAIRING_STEPS } from '@/utils/constants';
import { Tabs, Tab } from '@/ui/Tabs';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxhooks';
import MobileCompatibility from './MobileCompatibility';
import Orientation from './Orientation';
import Pairing from './Pairing';
import StepHeader from '@/ui/StepHeader';

const MobileCameraStep = () => {
  const dispatch = useAppDispatch();
  const {
    acknowledged,
    subSteps,
    activeSubStep,
  } = useAppSelector((state) => selectStep(state, 'mobileCameraShare'));

  const areAllSubstepsCompleted = Object.values(subSteps).every(
    (step) => step.status === 'completed',
  );

  const status = evaluateParentStepStatus(Object.values(subSteps));
  const canProceed = acknowledged && areAllSubstepsCompleted;

  const handleCheckboxChange = () => {
    dispatch(
      setStepAcknowledged({
        step: 'mobileCameraShare',
        acknowledged: !acknowledged,
      }),
    );
  };

  return (
    <div className='p-8 flex-1 overflow-y-auto'>
      <StepHeader
        stepNumber='3'
        title='Mobile Camera Pairing Permissions'
        description='Test if screen share permissions are enabled. If not, follow the instructions below to enable them'
        status={status}
      />
      <Tabs activeTab={activeSubStep} className="mt-20">
        <Tab label="Scan Code & Pair Mobile"
          name={PAIRING_STEPS.pairing}
          isDisabled
          isCompleted={subSteps[PAIRING_STEPS.pairing].status === 'completed'}
        >
          <Pairing />
        </Tab>
        <Tab
          label="Camera Orientation"
          name={PAIRING_STEPS.orientation}
          isDisabled
          isCompleted={subSteps[PAIRING_STEPS.orientation].status === 'completed'}
        >
          <Orientation />
        </Tab>
        <Tab label="Mobile System Check"
          name={PAIRING_STEPS.mobileCompatibility}
          isDisabled
          isCompleted={subSteps[PAIRING_STEPS.mobileCompatibility].status === 'completed'}
        >
          <MobileCompatibility />
        </Tab>
      </Tabs>
      {activeSubStep === PAIRING_STEPS.mobileCompatibility && (<div className='mt-8'>
        <div className='flex items-start gap-2 mt-6 text-sm'>
          <Checkbox
            className="mt-2 mr-2"
            id='confirm'
            checked={acknowledged}
            onCheckedChange={handleCheckboxChange}
          />
          <label htmlFor='confirm' className='text-xs text-gray-600'>
            By clicking on this, you confirm that your mobile phone is paired
            and will remain charged during the test. If disconnected, you&apos;ll
            need to reconnect before being able to continue with the test.
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
      </div>)}
    </div>
  );
};

export default MobileCameraStep;
