import { AppDispatch } from '@/store/store';
import {
  setSubStepStatus,
  setSubStepError,
  setActiveStep,
} from '@/store/features/workflowSlice';

export default class WebcamHandlers {
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
  }

  onWebcamDisabled() {
    this.dispatch(
      setSubStepError({
        step: 'cameraShare',
        subStep: 'cameraShare',
        error: 'Failed to access camera',
      })
    );
    this.dispatch(setActiveStep('cameraShare'));
  }

  onSnapshotSuccess() {
    console.log('Snapshot success');
  }

  onSnapshotFailure() {
    console.log('Snapshot failure');
  }
}