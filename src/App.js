import React, { useEffect } from 'react';

import { useAppDispatch } from '@/hooks/reduxhooks';
import {
  setAssessmentInfo,
  setProctor,
} from '@/store/features/assessmentInfoSlice';
import CompatibilityModal from '@/components/CompatibilityModal';
import { ScreenShareHandlers } from '@/store/handlers/screenShare';
import { WebcamHandlers } from '@/store/handlers/webcam';

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
}) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initializeProctoring = async () => {
      try {
        const Proctor = (await import('./proctor')).default;
        const screenShareHandlers = new ScreenShareHandlers(dispatch);
        const webcamHandlers = new WebcamHandlers(dispatch);

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
            // onFullScreenEnabled: callbacks.onFullScreenEnabled || (() => {}),
            // onFullScreenDisabled: callbacks.onFullScreenDisabled || (() => {}),
            // onDisqualified: callbacks.onDisqualified || (() => {}),
            // onCompatibilityCheckSuccess:
            //   callbacks.onCompatibilityCheckSuccess || (() => {}),
            // onCompatibilityCheckFail:
            //   callbacks.onCompatibilityCheckFail || (() => {}),
          },
          enableAllAlerts,
          headerOptions,
          mockModeEnabled,
        });

        // await proctor.initializeProctoring();
        dispatch(setAssessmentInfo(assessmentInfo));
        dispatch(setProctor(proctor));
      } catch (error) {
        console.error('Proctoring initialization failed:', error);
      }
    };

    initializeProctoring();
  }, [dispatch]);

  return <CompatibilityModal />;
};

export default App;
