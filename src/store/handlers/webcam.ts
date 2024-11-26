import { AppDispatch } from '@/store/store';
import {
  setSubStepStatus,
  setSubStepError,
  setStepStatus,
} from '@/store/features/workflowSlice';

export class WebcamHandlers {
  private dispatch: AppDispatch;

  constructor(dispatch: AppDispatch) {
    this.dispatch = dispatch;
    this.onWebcamEnabled = this.onWebcamEnabled.bind(this);
    this.onWebcamDisabled = this.onWebcamDisabled.bind(this);
    this.onSnapshotSuccess = this.onSnapshotSuccess.bind(this);
    this.onSnapshotFailure = this.onSnapshotFailure.bind(this);
  }

  onWebcamEnabled() {
    this.dispatch(
      setSubStepStatus({
        step: 'cameraShare',
        subStep: 'cameraShare',
        status: 'completed',
        clearError: true,
      })
    );
    this.dispatch(
      setStepStatus({
        step: 'cameraShare',
        status: 'completed',
      })
    );
  }

  onWebcamDisabled() {
    this.dispatch(
      setSubStepError({
        step: 'cameraShare',
        subStep: 'cameraShare',
        error: 'Failed to access camera',
      })
    );
    this.dispatch(
      setStepStatus({
        step: 'cameraShare',
        status: 'error',
      })
    );
  }

  onSnapshotSuccess() {
    console.log('Snapshot success');
  }

  onSnapshotFailure() {
    console.log('Snapshot failure');
  }
}
