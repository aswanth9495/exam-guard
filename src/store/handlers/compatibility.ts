import { AppDispatch } from '@/store/store';
import { ERROR_MESSAGES } from '@/constants/screenshot';
import {
  setSubStepStatus,
  setSubStepError,
  setActiveStep,
  setModalOpen,
} from '@/store/features/workflowSlice';

const CHECK_TO_STEP_MAP: Record<string, { step: string; subStep: string }> = {
  screenshare: { step: 'screenShare', subStep: 'screenShare' },
  webcam: { step: 'cameraShare', subStep: 'cameraShare' },
  browser: { step: 'compatibilityChecks', subStep: 'systemChecks' },
  networkSpeed: { step: 'compatibilityChecks', subStep: 'networkChecks' },
  fullscreen: { step: 'compatibilityChecks', subStep: 'fullScreenCheck' },
  mobileSetup: { step: 'mobileCameraShare', subStep: 'codeScan' },
  mobileSnapshot: { step: 'mobileCameraShare', subStep: 'cameraPairing' },
  mobileBattery: { step: 'mobileCameraShare', subStep: 'systemChecks' },
};

export default class CompatibilityHandlers {
  private dispatch: AppDispatch;

  constructor(dispatch: AppDispatch) {
    this.dispatch = dispatch;
  }

  handleFullScreenEnabled = () => {
    this.dispatch(
      setSubStepStatus({
        step: 'compatibilityChecks',
        subStep: 'fullScreenCheck',
        status: 'completed',
        clearError: true,
      }),
    );
  };

  handleFullScreenDisabled = () => {
    this.dispatch(setActiveStep('compatibilityChecks'));
    this.dispatch(
      setSubStepStatus({
        step: 'compatibilityChecks',
        subStep: 'fullScreenCheck',
        status: 'error',
      }),
    );
  };

  handleDisqualified = (errorCode: string) => {
    const errorMessage =
      ERROR_MESSAGES[errorCode as keyof typeof ERROR_MESSAGES] ||
      'Compatibility check failed. Please try again.';

    this.dispatch(setActiveStep('compatibilityChecks'));
    this.dispatch(
      setSubStepError({
        step: 'compatibilityChecks',
        subStep: 'systemChecks',
        error: errorMessage,
      }),
    );
  };

  handleCompatibilityCheckSuccess = () => {
    Object.values(CHECK_TO_STEP_MAP).forEach((mapping) => {
      this.dispatch(
        setSubStepStatus({
          step: mapping.step as
            | 'compatibilityChecks'
            | 'cameraShare'
            | 'screenShare',
          subStep: mapping.subStep,
          status: 'completed',
          clearError: true,
        }),
      );
    });
    this.dispatch(setModalOpen(false));
  };

  handleCompatibilityCheckFail = (errorCode: {
    passedChecks: Record<string, boolean>;
  }) => {
    let hasSetActiveStep = false;

    Object.keys(CHECK_TO_STEP_MAP).forEach((check) => {
      if (!(check in errorCode.passedChecks)) return;

      const passed = errorCode.passedChecks[check];
      const mapping = CHECK_TO_STEP_MAP[check];

      if (mapping) {
        this.dispatch(
          setSubStepStatus({
            step: mapping.step as
              | 'compatibilityChecks'
              | 'cameraShare'
              | 'screenShare',
            subStep: mapping.subStep,
            status: passed ? 'completed' : 'error',
            clearError: true,
          }),
        );

        if (!passed && !hasSetActiveStep) {
          this.dispatch(
            setActiveStep(
              mapping.step as
                | 'compatibilityChecks'
                | 'cameraShare'
                | 'screenShare',
            ),
          );
          hasSetActiveStep = true;
        }
      }
    });
    this.dispatch(setModalOpen(true));
  };
}
