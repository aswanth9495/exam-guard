import React from 'react';
import { Monitor, Camera, Smartphone, Settings } from 'lucide-react';
import { Step } from '@/types/workflowTypes';
import ScreenShareStep from '@/components/ScreenShareStep';
import DesktopCameraStep from '@/components/DesktopCameraStep';
import MobileCameraStep from '@/components/MobileCameraStep';
import SystemChecksStep from '@/components/SystemChecksStep';

export const STEPS: Record<string, Step> = {
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
