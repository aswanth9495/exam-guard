import { AppDispatch } from '@/store/store';
import { ERROR_MESSAGES } from '@/constants/screenshot';
import {
  setSubStepStatus,
  setSubStepError,
  setActiveStep,
  setModalOpen,
} from '@/store/features/workflowSlice';
import { StepState } from '@/types/workflowTypes';

const CHECK_TO_STEP_MAP: Record<string, { step: string; subStep: string }> = {
  screenshare: { step: 'screenShare', subStep: 'screenShare' },
  webcam: { step: 'cameraShare', subStep: 'cameraShare' },
  mobileSetup: { step: 'mobileCameraShare', subStep: 'codeScan' },
  mobileSnapshot: { step: 'mobileCameraShare', subStep: 'cameraPairing' },
  mobileBattery: { step: 'mobileCameraShare', subStep: 'systemChecks' },
  browser: { step: 'compatibilityChecks', subStep: 'systemChecks' },
  networkSpeed: { step: 'compatibilityChecks', subStep: 'networkChecks' },
  fullscreen: { step: 'compatibilityChecks', subStep: 'fullScreenCheck' },
};

export default class CompatibilityHandlers {
  private dispatch: AppDispatch;
  private steps: Record<string, StepState>;
  private enableProctoring: boolean;
  private readonly CHECK_ORDER = [
    'screenshare',
    'webcam',
    'mobileSetup',
    'mobileSnapshot',
    'mobileBattery',
    'browser',
    'networkSpeed',
    'fullscreen'
  ];

  constructor(
    dispatch: AppDispatch,
    steps: Record<string, StepState>,
    enableProctoring: boolean,
  ) {
    this.dispatch = dispatch;
    this.steps = steps;
    this.enableProctoring = enableProctoring;
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
    // this.dispatch(setActiveStep('compatibilityChecks'));
    // this.dispatch(
    //   setSubStepStatus({
    //     step: 'compatibilityChecks',
    //     subStep: 'fullScreenCheck',
    //     status: 'error',
    //   }),
    // );
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
    if (this.enableProctoring) {
      this.dispatch(setModalOpen(false));
    }
  };

  handleCompatibilityCheckFail = (
    errorCode: {
      passedChecks: Record<string, boolean>;
    },
  ) => {
    let hasSetActiveStep = false;

    this.CHECK_ORDER.forEach((check) => {
      if (!(check in errorCode.passedChecks)) return;

      const passed = errorCode.passedChecks[check];
      const mapping = CHECK_TO_STEP_MAP[check];

      const isStepEnabled = this.steps[mapping.step]?.enabled;

      if (mapping && isStepEnabled) {
        this.dispatch(
          setSubStepStatus({
            step: mapping.step as
              | 'compatibilityChecks'
              | 'cameraShare'
              | 'screenShare',
            subStep: mapping.subStep,
            status: passed ? 'completed' : 'error',
            clearError: passed,
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
          this.dispatch(setModalOpen(true));
          hasSetActiveStep = true;
        }
      }
    });
  };
}
