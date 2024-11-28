import React, { useEffect } from 'react';

import { useAppDispatch } from '@/hooks/reduxhooks';
import {
  setAssessmentInfo,
  setProctor,
} from '@/store/features/assessmentInfoSlice';

import {
  setBulkStepEnabled,
  setModalOpen,
} from '@/store/features/workflowSlice';
import CompatibilityHandlers from '@/store/handlers/compatibility';
import CompatibilityModal from '@/components/CompatibilityModal';
import ScreenShareHandlers from '@/store/handlers/screenShare';
import WebcamHandlers from '@/store/handlers/webcam';

const App = ({
  baseUrl,
  eventsConfig,
  disqualificationConfig,
  config,
  snapshotConfig,
  screenshotConfig,
  compatibilityCheckConfig,
  callbacks,
  enableAllAlerts,
  headerOptions,
  mockModeEnabled,
  assessmentInfo,
  enableProctoring = false,
}) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initializeProctoring = async () => {
      try {
        const Proctor = (await import('./proctor')).default;
        const screenShareHandlers = new ScreenShareHandlers(dispatch);
        const webcamHandlers = new WebcamHandlers(dispatch);
        const compatibilityHandlers = new CompatibilityHandlers(dispatch);

        const proctor = new Proctor({
          baseUrl,
          eventsConfig,
          disqualificationConfig,
          config,
          snapshotConfig,
          screenshotConfig,
          compatibilityCheckConfig,
          callbacks: {
            ...callbacks,
            onScreenShareSuccess: screenShareHandlers.handleScreenShareSuccess,
            onScreenShareFailure: screenShareHandlers.handleScreenShareFailure,
            onScreenShareEnd: screenShareHandlers.handleScreenShareEnd,
            onScreenshotSuccess: screenShareHandlers.handleScreenshotSuccess,
            onScreenshotFailure: screenShareHandlers.handleScreenshotFailure,
            onWebcamEnabled: webcamHandlers.onWebcamEnabled,
            onWebcamDisabled: webcamHandlers.onWebcamDisabled,
            onSnapshotSuccess: webcamHandlers.onSnapshotSuccess,
            onSnapshotFailure: webcamHandlers.onSnapshotFailure,
            onFullScreenEnabled: compatibilityHandlers.handleFullScreenEnabled,
            onFullScreenDisabled:
              compatibilityHandlers.handleFullScreenDisabled,
            onDisqualified: compatibilityHandlers.handleDisqualified,
            onCompatibilityCheckSuccess:
              compatibilityHandlers.handleCompatibilityCheckSuccess,
            onCompatibilityCheckFail:
              compatibilityHandlers.handleCompatibilityCheckFail,
          },
          enableAllAlerts,
          headerOptions,
          mockModeEnabled,
        });

        if (enableProctoring) {
          await proctor.initializeProctoring();
          dispatch(setModalOpen(false));
        } else {
          dispatch(setModalOpen(true));
        }

        dispatch(setAssessmentInfo(assessmentInfo));
        dispatch(setProctor(proctor));
        dispatch(
          setBulkStepEnabled([
            {
              step: 'screenShare',
              enabled: true,
              subSteps: {
                screenShare: true,
              },
            },
            {
              step: 'cameraShare',
              enabled: true,
              subSteps: {
                cameraShare: true,
              },
            },
            {
              step: 'mobileCameraShare',
              enabled: false,
              subSteps: {
                codeScan: true,
                cameraPairing: true,
                systemChecks: true,
              },
            },
            {
              step: 'compatibilityChecks',
              enabled: true,
              subSteps: {
                systemChecks: true,
                networkChecks: true,
                fullScreenCheck: true,
              },
            },
          ]),
        );
      } catch (error) {
        console.error('Proctoring initialization failed:', error);
      }
    };

    initializeProctoring();
  }, [
    assessmentInfo,
    baseUrl,
    callbacks,
    compatibilityCheckConfig,
    config,
    dispatch,
    disqualificationConfig,
    enableAllAlerts,
    enableProctoring,
    eventsConfig,
    headerOptions,
    mockModeEnabled,
    screenshotConfig,
    snapshotConfig,
  ]);

  return <CompatibilityModal />;
};

export default App;
