import React from 'react';

import { useAppSelector } from '@/hooks/reduxhooks';
import { Modal } from '@/ui/modal';
import { STEPS } from '@/constants/workflow';
import CompatibilityModalHeader from '@/components/CompatibilityModalHeader';
import CompatibilityModalStepsScreen from '@/components/CompatibilityModalStepsScreen';

export default function CompatibilityModal() {
  const activeStep = useAppSelector((state) => state.workflow.activeStep);

  return (
    <Modal isOpen={true} modalClassName='w-[100%] h-[100%] flex'>
      <div className='bg-blue-50 p-12 pt-16 m-w-96 w-1/3'>
        <CompatibilityModalHeader />
        <CompatibilityModalStepsScreen />
      </div>
      {STEPS[activeStep].component}
    </Modal>
  );
}
