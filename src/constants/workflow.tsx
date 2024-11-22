import React from 'react';
import { Monitor, Camera, Smartphone, Settings } from 'lucide-react';
import { Step } from '@/types/globals';
import ScreenShareStep from '@/components/ScreenShareStep';
import DesktopCameraStep from '@/components/DesktopCameraStep';
import MobileCameraStep from '@/components/MobileCameraStep';
import SystemChecksStep from '@/components/SystemChecksStep';

export const STEPS: Record<string, Step> = {
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
