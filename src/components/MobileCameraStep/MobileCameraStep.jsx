import React, { useCallback, useState } from 'react';

import { ArrowRight } from 'lucide-react';
import { Button } from '@/ui/Button';
import { Checkbox } from '@/ui/Checkbox';
import { evaluateParentStepStatus } from '@/utils/evaluateParentStepStatus';
import {
  nextStep,
  selectStep,
  setStepAcknowledged,
} from '@/store/features/workflowSlice';
import { PAIRING_STEPS } from '@/utils/constants';
import { Tabs, Tab } from '@/ui/Tabs';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxhooks';
import MobileCompatibility from './MobileCompatibility';
import Orientation from './Orientation';
import Pairing from './Pairing';
import StepHeader from '@/ui/StepHeader';
import SwitchPhoneModal from './SwitchPhoneModal';

const MobileCameraStep = () => {
  const dispatch = useAppDispatch();
  const { acknowledged, subSteps, activeSubStep } = useAppSelector((state) => (
    selectStep(state, 'mobileCameraShare')
  ));
  const [isSwitchModalOpen, setSwitchModalOpen] = useState(false);
  const { enableProctoring } = useAppSelector((state) => state.workflow);

  const areAllSubstepsCompleted = Object.values(subSteps).every(
    (step) => step.status === 'completed',
  );

  const status = evaluateParentStepStatus(Object.values(subSteps));
  const canProceed = enableProctoring || (acknowledged && areAllSubstepsCompleted);

  const handleCheckboxChange = () => {
    dispatch(
      setStepAcknowledged({
        step: 'mobileCameraShare',
        acknowledged: !acknowledged,
      }),
    );
  };

  const handleModalClose = useCallback(() => {
    setSwitchModalOpen(false);
  }, []);

  return (
    <div className='p-20 pt-12 flex-1 overflow-y-auto'>
      <StepHeader
        stepNumber='3'
        title='Mobile Camera Pairing Permissions'
        description='Test if screen share permissions are enabled. If not, follow the instructions below to enable them'
        status={status}
      />
      <Tabs activeTab={activeSubStep} className='mt-20'>
        <Tab
          label='Scan Code & Pair Mobile'
          name={PAIRING_STEPS.pairing}
          isDisabled
          isCompleted={subSteps[PAIRING_STEPS.pairing].status === 'completed'}
        >
          <Pairing />
        </Tab>
        <Tab
          label='Camera Orientation'
          name={PAIRING_STEPS.orientation}
          isDisabled
          isCompleted={
            subSteps[PAIRING_STEPS.orientation].status === 'completed'
          }
        >
          <Orientation setSwitchModalOpen={setSwitchModalOpen} />
        </Tab>
        <Tab
          label='Mobile System Check'
          name={PAIRING_STEPS.mobileCompatibility}
          isDisabled
          isCompleted={
            subSteps[PAIRING_STEPS.mobileCompatibility].status === 'completed'
          }
        >
          <MobileCompatibility />
        </Tab>
      </Tabs>
      {!enableProctoring
        && [PAIRING_STEPS.mobileCompatibility].includes(
          activeSubStep,
        ) && (
          <div className='mt-8'>
            <div className='flex items-center gap-2 mt-16 text-xs'>
            <Checkbox
              id='confirm'
              className='mt-2 mr-2'
              checked={acknowledged}
              onCheckedChange={handleCheckboxChange}
            />
            <label htmlFor='confirm' className='text-xs text-gray-600'>
              By clicking on this, you confirm that your mobile phone is paired
              and will remain charged during the test. If disconnected,
              you&apos;ll need to reconnect before being able to continue with
              the test.
            </label>
          </div>
          <Button
          className='mt-8 items-center py-8 px-10'
            variant='primary'
            disabled={!canProceed}
            onClick={() => dispatch(nextStep())}
          >
            {enableProctoring ? 'Confirm Settings' : (
              <>
                Proceed to next step
                <ArrowRight className='w-6 h-6' />
              </>
            )}
          </Button>
          {activeSubStep !== PAIRING_STEPS.pairing && (<Button
            className='mt-8 items-center py-8 px-10 ml-6'
            variant='outline'
            disabled={activeSubStep === PAIRING_STEPS.pairing}
            onClick={() => setSwitchModalOpen(true)}
          >
            Scan QR Code again
          </Button>)}
        </div>
      )}
      <SwitchPhoneModal
        isOpen={isSwitchModalOpen}
        onClose={handleModalClose}
      />
    </div>
  );
};

export default MobileCameraStep;
