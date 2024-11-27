export interface RootState {
  user: {
    name: string;
  };
}

export interface Step {
  icon: React.ElementType;
  title: string;
  component: React.ReactNode;
}

export type Status = 'locked' | 'pending' | 'error' | 'completed';

export interface SubStepState {
  status: Status;
  error: string;
}

export interface StepState {
  locked: boolean;
  acknowledged: boolean;
  status: Status;
  activeSubStep: string;
  subStep: Record<string, SubStepState>;
}

export interface WorkflowState {
  activeStep: WorkflowStepKey;
  steps: {
    screenShare: StepState;
    cameraShare: StepState;
    mobileCameraShare: StepState;
    compatibilityChecks: StepState;
  };
}

export type WorkflowStepKey = keyof WorkflowState['steps'];
