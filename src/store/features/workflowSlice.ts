import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { STEPS } from '@/constants/workflow';

interface WorkflowState {
  activeStep: string;
}

const initialState: WorkflowState = {
  activeStep: '1',
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
  },
});

export const { setActiveStep, nextStep } = workflowSlice.actions;

export default workflowSlice.reducer;
