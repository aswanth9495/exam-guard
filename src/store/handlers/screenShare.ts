import { AppDispatch } from '@/store/store';
import {
  setSubStepStatus,
  setSubStepError,
  setStepStatus,
} from '@/store/features/workflowSlice';
import { ERROR_MESSAGES } from '@/constants/screenshot';

export class ScreenShareHandlers {
  private dispatch: AppDispatch;

  constructor(dispatch: AppDispatch) {
    this.dispatch = dispatch;
  }

  handleScreenShareSuccess = () => {
    this.dispatch(
      setSubStepStatus({
        step: 'screenShare',
        subStep: 'screenShare',
        status: 'completed',
        clearError: true,
      })
    );
    this.dispatch(
      setStepStatus({
        step: 'screenShare',
        status: 'completed',
      })
    );
  };

  handleScreenShareFailure = (errorCode: string) => {
    const errorMessage =
      ERROR_MESSAGES[errorCode as keyof typeof ERROR_MESSAGES] ||
      'Screen share validation failed. Please try again.';

    this.dispatch(
      setSubStepError({
        step: 'screenShare',
        subStep: 'screenShare',
        error: errorMessage,
      })
    );
    this.dispatch(
      setStepStatus({
        step: 'screenShare',
        status: 'error',
      })
    );
  };

  handleScreenShareEnd = () => {
    this.dispatch(
      setSubStepStatus({
        step: 'screenShare',
        subStep: 'screenShare',
        status: 'pending',
        clearError: true,
      })
    );
    this.dispatch(
      setStepStatus({
        step: 'screenShare',
        status: 'pending',
      })
    );
  };

  handleScreenshotSuccess = () => {
    console.log('Screenshot captured successfully');
  };

  handleScreenshotFailure = (err: any) => {
    console.error('Screenshot capture failed', err);
  };
}
