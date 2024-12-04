import React, { useMemo, useEffect } from 'react';
import { Monitor, Camera, Smartphone, Settings } from 'lucide-react';

import { useAppDispatch, useAppSelector } from '@/hooks/reduxhooks';
import { Modal } from '@/ui/Modal';
import { Step, WorkflowStepKey } from '@/types/workflowTypes';
import CompatibilityModalHeader from '@/components/CompatibilityModalHeader';
import CompatibilityModalStepsScreen from '@/components/CompatibilityModalStepsScreen';
import DesktopCameraStep from '@/components/DesktopCameraStep';
import DisqualificationTimerBar from '@/components/DisqualificationTimerBar';
import MobileCameraStep from '@/components/MobileCameraStep';
import ScreenShareStep from '@/components/ScreenShareStep';
import SystemChecksStep from '@/components/SystemChecksStep';

const ALL_STEPS: Record<string, Step> = {
  screenShare: {
    icon: Monitor,
    title: 'Screen Share Permissions',
    component: <ScreenShareStep />,
  },
  cameraShare: {
    icon: Camera,
    title: 'Desktop Camera Permissions',
    component: <DesktopCameraStep />,
  },
  mobileCameraShare: {
    icon: Smartphone,
    title: 'Mobile Camera Pairing',
    component: <MobileCameraStep />,
  },
  compatibilityChecks: {
    icon: Settings,
    title: 'System Compatibility Checks',
    component: <SystemChecksStep />,
  },
};

export default function CompatibilityModal() {
  const dispatch = useAppDispatch();
  const { activeStep, enableProctoring, steps, modalOpen } = useAppSelector(
    (state) => state.workflow,
  );

  const enabledSteps = useMemo(() => {
    return Object.entries(ALL_STEPS).reduce(
      (acc, [key, step]) => {
        if (steps[key as WorkflowStepKey]?.enabled) {
          acc[key] = step;
        }
        return acc;
      },
      {} as Record<string, Step>,
    );
  }, [steps]);

  // Precautionary check to ensure that the modal is closed if all substeps are completed
  useEffect(() => {
    if (!enableProctoring || !modalOpen) return;

    const allSubstepsCompleted = Object.entries(steps)
      .filter(([key]) => steps[key as WorkflowStepKey]?.enabled)
      .every(([, stepData]) => 
        Object.values(stepData?.subSteps ?? {}).every(substep => substep.status === 'completed')
      );
  }, [steps, enabledSteps, enableProctoring, modalOpen, dispatch]);

  return (
    <Modal
      isOpen={modalOpen}
      modalClassName='w-[100%] h-[100%] flex flex-col items-stretch'
    >
      {modalOpen && enableProctoring && activeStep && (
        <DisqualificationTimerBar
          activeStep={activeStep}
          modalOpen={modalOpen}
        />
      )}
      <div className='grow flex flex-row items-stretch'>
        <div className='bg-blue-50 p-20 pt-24 m-w-96 w-1/3'>
          <CompatibilityModalHeader />
          <CompatibilityModalStepsScreen step_data={enabledSteps} />
        </div>
        {enabledSteps[activeStep]?.component}
      </div>
    </Modal>
  );
}
