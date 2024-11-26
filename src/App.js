import React, { useEffect } from 'react';

import { useAppDispatch } from '@/hooks/reduxhooks';
import {
  setAssessmentInfo,
  setProctor,
} from '@/store/features/assessmentInfoSlice';
import CompatibilityModal from '@/components/CompatibilityModal';
import { CallbackHandlers } from '@/utils/callbackHandlers';

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
        const callbackHandlers = new CallbackHandlers(dispatch);

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
            onScreenShareSuccess: callbackHandlers.handleScreenShareSuccess,
            onScreenShareFailure: callbackHandlers.handleScreenShareFailure,
            onScreenShareEnd: callbackHandlers.handleScreenShareEnd,
            onScreenshotSuccess: callbackHandlers.handleScreenshotSuccess,
            onScreenshotFailure: callbackHandlers.handleScreenshotFailure,
            // onDisqualified: callbacks.onDisqualified || (() => {}),
            // onWebcamDisabled: callbacks.onWebcamDisabled || (() => {}),
            // onWebcamEnabled: callbacks.onWebcamEnabled || (() => {}),
            // onSnapshotSuccess: callbacks.onSnapshotSuccess || (() => {}),
            // onSnapshotFailure: callbacks.onSnapshotFailure || (() => {}),
            // onFullScreenEnabled: callbacks.onFullScreenEnabled || (() => {}),
            // onFullScreenDisabled: callbacks.onFullScreenDisabled || (() => {}),
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
