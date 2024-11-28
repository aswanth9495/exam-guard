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
  mobilePairingConfig,
  callbacks,
  enableAllAlerts,
  headerOptions,
  mockModeEnabled,
  assessmentInfo,
  qrCodeConfig,
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
          mobilePairingConfig,
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
            // onCompatibilityCheckFail: (data) => { console.log('%c⧭', 'color: #e5de73', data); },
            //   callbacks.onCompatibilityCheckFail || (() => {}),
          },
          enableAllAlerts,
          headerOptions,
          mockModeEnabled,
          qrCodeConfig,
        });

        // console.log('%c⧭', 'color: #ffa280');
        /* uncomment this in case you want the comp checks to run in intervals */
        // proctor?.startCompatibilityChecks();
        // await proctor.initializeProctoring();
        dispatch(setAssessmentInfo(assessmentInfo));
        dispatch(setProctor(proctor));
      } catch (error) {
        console.error('Proctoring initialization failed:', error);
      }
    };

    initializeProctoring();
  }, [assessmentInfo, baseUrl, callbacks,
    compatibilityCheckConfig, config, dispatch,
    disqualificationConfig, enableAllAlerts, eventsConfig,
    headerOptions, mobilePairingConfig, mockModeEnabled,
    qrCodeConfig, screenshotConfig, snapshotConfig]);

  return <CompatibilityModal />;
};

export default App;
