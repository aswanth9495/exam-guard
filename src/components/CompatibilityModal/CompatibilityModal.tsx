import React from 'react';
import { useAppSelector } from '@/hooks/reduxhooks';
import { Modal } from '@/ui/modal';
import ScreenShareStep from '@/components/ScreenShareStep';
import CompatibilityModalStepsScreen from '@/components/CompatibilityModalStepsScreen';
import Logo from '@/assets/images/logo.svg';
import { Monitor, Camera, Smartphone, Settings } from 'lucide-react';
import { useState } from 'react';
import { Step } from '@/global/types';
import DesktopCameraStep from '@/components/DesktopCameraStep';
import MobileCameraStep from '@/components/MobileCameraStep';
import SystemChecksStep from '@/components/SystemChecksStep';

const steps: Record<string, Step> = {
  '1': {
    icon: Monitor,
    title: 'Screen Share Permissions',
    component: <ScreenShareStep />,
  },
  '2': {
    icon: Camera,
    title: 'Desktop Camera Permissions',
    component: <DesktopCameraStep />,
  },
  '3': {
    icon: Smartphone,
    title: 'Mobile Camera Pairing',
    component: <MobileCameraStep />,
  },
  '4': {
    icon: Settings,
    title: 'System Compatibility Checks',
    component: <SystemChecksStep />,
  },
};

export default function CompatibilityModal() {
  const assessmentInfo = useAppSelector((state) => state.assessmentInfo);
  const [activeStep, setActiveStep] = useState('1');

  return (
    <Modal isOpen={true} modalClassName='w-[90%] h-[90%] flex'>
      <div className='bg-blue-50 p-8 pt-12 m-w-96 w-1/3'>
        <img src={Logo} alt='Scaler Logo' className='h-4' />
        <div className='mt-8'>
          <p className='text-gray-600'>Hi {assessmentInfo?.userName}!</p>
          <h1 className='text-2xl font-bold mt-2'>
            {assessmentInfo?.assessmentName}
          </h1>
        </div>

        <CompatibilityModalStepsScreen
          steps={steps}
          activeStep={parseInt(activeStep)}
          setActiveStep={(step) => setActiveStep(step.toString())}
        />
      </div>
      {steps[activeStep].component}
    </Modal>
  );
}
