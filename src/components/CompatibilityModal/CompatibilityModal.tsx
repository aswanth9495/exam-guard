import React, { useMemo } from 'react';
import { Monitor, Camera, Smartphone, Settings } from 'lucide-react';

import { useAppSelector } from '@/hooks/reduxhooks';
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

  return (
    <Modal
      isOpen={modalOpen}
      modalClassName='w-[100%] h-[100%] flex flex-col items-stretch'
    >
      {enableProctoring && activeStep && (
        <DisqualificationTimerBar
          activeStep={activeStep}
          modalOpen={modalOpen}
        />
      )}
      <div className='grow flex flex-row items-stretch'>
        <div className='bg-blue-50 p-12 pt-16 m-w-96 w-1/3'>
          <CompatibilityModalHeader />
          <CompatibilityModalStepsScreen step_data={enabledSteps} />
        </div>
        {enabledSteps[activeStep].component}
      </div>
    </Modal>
  );
}
