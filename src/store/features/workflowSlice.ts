import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { STEPS } from '@/constants/workflow';

interface StepState {
  status: 'pending' | 'error' | 'warning' | 'completed';
  acknowledged: boolean;
  locked: boolean;
}

interface WorkflowState {
  activeStep: string;
  steps: Record<string, StepState>;
}

const initialState: WorkflowState = {
  activeStep: '1',
  steps: {
    '1': { status: 'pending', acknowledged: false, locked: false },
    '2': { status: 'pending', acknowledged: false, locked: true },
    '3': { status: 'pending', acknowledged: false, locked: true },
    '4': { status: 'pending', acknowledged: false, locked: true },
  },
};

const workflowSlice = createSlice({
  name: 'workflow',
  initialState,
  reducers: {
    setActiveStep(state, action: PayloadAction<string>) {
      state.activeStep = action.payload;
    },
    nextStep(state) {
      const currentStep = parseInt(state.activeStep);
      const nextStep = (currentStep + 1).toString();
      if (STEPS[nextStep]) {
        state.activeStep = nextStep;
      }
    },
    updateStepStatus(
      state,
      action: PayloadAction<{
        step: string;
        stepState: StepState;
      }>
    ) {
      const { step, stepState } = action.payload;
      if (state.steps[step]) {
        state.steps[step] = stepState;
      }
    },
    acknowledgeStep(state, action: PayloadAction<string>) {
      const step = action.payload;
      if (state.steps[step]) {
        state.steps[step].acknowledged = !state.steps[step].acknowledged;
      }
    },
  },
});

export const { setActiveStep, nextStep, updateStepStatus, acknowledgeStep } =
  workflowSlice.actions;

export default workflowSlice.reducer;
