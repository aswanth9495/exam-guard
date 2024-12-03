import React, { useEffect, useMemo } from 'react';

import { useAppDispatch, useAppSelector } from '@/hooks/reduxhooks';
import {
  setAssessmentInfo,
  setProctor,
} from '@/store/features/assessmentInfoSlice';

import {
  setBulkStepEnabled,
  setModalOpen,
  setEnableProctoring,
  setOnWorkflowComplete,
} from '@/store/features/workflowSlice';
import CompatibilityHandlers from '@/store/handlers/compatibility';
import CompatibilityModal from '@/components/CompatibilityModal';
import Proctor from '@/proctor';
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
  mobilePairingConfig,
  callbacks,
  enableAllAlerts,
  headerOptions,
  mockModeEnabled,
  assessmentInfo,
  qrCodeConfig,
  enableProctoring = false,
}) => {
  const dispatch = useAppDispatch();
  const { enableProctoring: enableProctoringState } = useAppSelector(
    (state) => state.workflow,
  );

  const proctor = useMemo(() => {
    const screenShareHandlers = new ScreenShareHandlers(dispatch);
    const webcamHandlers = new WebcamHandlers(dispatch);
    const compatibilityHandlers = new CompatibilityHandlers(dispatch);

    return new Proctor({
      baseUrl,
      eventsConfig,
      disqualificationConfig,
      config,
      snapshotConfig,
      screenshotConfig,
      compatibilityCheckConfig,
      mobilePairingConfig,
      callbacks: {
        onScreenShareSuccess: (...args) => {
          callbacks?.onScreenShareSuccess?.(...args);
          screenShareHandlers.handleScreenShareSuccess(...args);
        },
        onScreenShareFailure: (...args) => {
          callbacks?.onScreenShareFailure?.(...args);
          screenShareHandlers.handleScreenShareFailure(...args);
        },
        onScreenShareEnd: (...args) => {
          callbacks?.onScreenShareEnd?.(...args);
          screenShareHandlers.handleScreenShareEnd(...args);
        },
        onScreenshotSuccess: (...args) => {
          callbacks?.onScreenshotSuccess?.(...args);
        },
        onScreenshotFailure: (...args) => {
          callbacks?.onScreenshotFailure?.(...args);
          screenShareHandlers.handleScreenshotFailure(...args);
        },
        onWebcamEnabled: (...args) => {
          callbacks?.onWebcamEnabled?.(...args);
          webcamHandlers.onWebcamEnabled(...args);
        },
        onWebcamDisabled: (...args) => {
          callbacks?.onWebcamDisabled?.(...args);
          webcamHandlers.onWebcamDisabled(...args);
        },
        onSnapshotSuccess: (...args) => {
          callbacks?.onSnapshotSuccess?.(...args);
        },
        onSnapshotFailure: (...args) => {
          callbacks?.onSnapshotFailure?.(...args);
          webcamHandlers.onSnapshotFailure(...args);
        },
        onFullScreenEnabled: (...args) => {
          callbacks?.onFullScreenEnabled?.(...args);
          compatibilityHandlers.handleFullScreenEnabled(...args);
        },
        onFullScreenDisabled: (...args) => {
          callbacks?.onFullScreenDisabled?.(...args);
          compatibilityHandlers.handleFullScreenDisabled(...args);
        },
        onDisqualified: (...args) => {
          callbacks?.onDisqualified?.(...args);
          compatibilityHandlers.handleDisqualified(...args);
        },
        onCompatibilityCheckSuccess: (...args) => {
          callbacks?.onCompatibilityCheckSuccess?.(...args);
          compatibilityHandlers.handleCompatibilityCheckSuccess(...args);
        },
        onCompatibilityCheckFail: (...args) => {
          callbacks?.onCompatibilityCheckFail?.(...args);
          compatibilityHandlers.handleCompatibilityCheckFail(...args);
        },
      },
      enableAllAlerts,
      headerOptions,
      mockModeEnabled,
      qrCodeConfig,
    });
  }, [
    baseUrl,
    callbacks,
    compatibilityCheckConfig,
    config,
    dispatch,
    disqualificationConfig,
    enableAllAlerts,
    eventsConfig,
    headerOptions,
    mobilePairingConfig,
    mockModeEnabled,
    qrCodeConfig,
    screenshotConfig,
    snapshotConfig,
  ]);

  const steps = useMemo(
    () => [
      { step: 'screenShare', enabled: screenshotConfig.enabled ?? true },
      { step: 'cameraShare', enabled: snapshotConfig.enabled ?? true },
      {
        step: 'mobileCameraShare',
        enabled: mobilePairingConfig.enabled ?? true,
      },
      {
        step: 'compatibilityChecks',
        enabled: compatibilityCheckConfig.enable ?? true,
      },
    ],
    [
      screenshotConfig.enabled,
      snapshotConfig.enabled,
      mobilePairingConfig.enabled,
      compatibilityCheckConfig.enable,
    ],
  );

  useEffect(() => {
    const initializeProctoring = async () => {
      try {
        if (enableProctoring || enableProctoringState) {
          await proctor.initializeProctoring();
          dispatch(setModalOpen(false));
        } else {
          dispatch(setModalOpen(true));
        }
        dispatch(setAssessmentInfo(assessmentInfo));
        dispatch(
          setEnableProctoring(enableProctoring || enableProctoringState),
        );
        dispatch(setOnWorkflowComplete(callbacks?.onWorkflowComplete));
        dispatch(setProctor(proctor));
        dispatch(setBulkStepEnabled(steps));
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
    enableProctoringState,
    eventsConfig,
    headerOptions,
    mobilePairingConfig,
    mockModeEnabled,
    proctor,
    qrCodeConfig,
    screenshotConfig,
    snapshotConfig,
    steps,
  ]);

  return <CompatibilityModal />;
};

export default App;
