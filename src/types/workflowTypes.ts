export interface Step {
  icon: React.ElementType;
  title: string;
  component: React.ReactNode;
}

export type Status = 'locked' | 'pending' | 'error' | 'completed';

export interface SubStepState {
  status: Status;
  error: string;
  enabled: boolean;
}

export interface StepState {
  locked: boolean;
  enabled: boolean;
  acknowledged: boolean;
  activeSubStep: string;
  subSteps: Record<string, SubStepState>;
  setupMode: boolean;
}

export interface WorkflowState {
  enableProctoring: boolean;
  modalOpen: boolean;
  activeStep: WorkflowStepKey;
  steps: {
    screenShare: StepState;
    cameraShare: StepState;
    mobileCameraShare: StepState;
    compatibilityChecks: StepState;
  };
  onWorkflowComplete: () => void;
}

export type StepEnableConfig = {
  step: WorkflowStepKey;
  enabled: boolean;
  subSteps?: {
    [key: string]: boolean;
  };
};

export type WorkflowStepKey = keyof WorkflowState['steps'];
