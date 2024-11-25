import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  Status,
  SubStepState,
  StepState,
  WorkflowState,
  WorkflowStepKey,
} from '@/types/globals';

const createSubStep = (): SubStepState => ({
  status: 'locked',
  error: '',
});

const createStep = (subSteps: string[], locked = true): StepState => ({
  locked,
  acknowledged: false,
  status: 'locked',
  subStep: subSteps.reduce(
    (acc, step) => ({
      ...acc,
      [step]: createSubStep(),
    }),
    {}
  ),
});

const initialState: WorkflowState = {
  activeStep: 'screenShare',
  steps: {
    screenShare: createStep(['screenShare'], false),
    cameraShare: createStep(['cameraShare']),
    mobileCameraShare: createStep([
      'codeScan',
      'cameraPairing',
      'systemChecks',
    ]),
    compatibilityChecks: createStep([
      'systemChecks',
      'networkChecks',
      'fullScreenCheck',
    ]),
  },
};

const workflowSlice = createSlice({
  name: 'workflow',
  initialState,
  reducers: {
    setActiveStep(state, action: PayloadAction<WorkflowStepKey>) {
      state.activeStep = action.payload;
    },

    nextStep(state) {
      const steps = Object.keys(state.steps) as WorkflowStepKey[];
      const currentIndex = steps.indexOf(state.activeStep);
      if (currentIndex < steps.length - 1) {
        const nextStepKey = steps[currentIndex + 1];
        if (state.steps[nextStepKey].locked) {
          state.steps[nextStepKey].locked = false;
        }
        state.activeStep = nextStepKey;
      }
    },

    setStepLocked(
      state,
      action: PayloadAction<{
        step: WorkflowStepKey;
        locked: boolean;
      }>
    ) {
      const { step, locked } = action.payload;
      state.steps[step].locked = locked;
    },

    setStepAcknowledged(
      state,
      action: PayloadAction<{
        step: WorkflowStepKey;
        acknowledged: boolean;
      }>
    ) {
      const { step, acknowledged } = action.payload;
      state.steps[step].acknowledged = acknowledged;
    },

    setStepStatus(
      state,
      action: PayloadAction<{
        step: WorkflowStepKey;
        status: Status;
      }>
    ) {
      const { step, status } = action.payload;
      state.steps[step].status = status;
    },

    setSubStepStatus(
      state,
      action: PayloadAction<{
        step: WorkflowStepKey;
        subStep: string;
        status: Status;
        clearError?: boolean;
      }>
    ) {
      const { step, subStep, status, clearError } = action.payload;
      state.steps[step].subStep[subStep].status = status;
      if (clearError) {
        state.steps[step].subStep[subStep].error = '';
      }
    },

    setSubStepError(
      state,
      action: PayloadAction<{
        step: WorkflowStepKey;
        subStep: string;
        error: string;
      }>
    ) {
      const { step, subStep, error } = action.payload;
      state.steps[step].subStep[subStep].status = 'error';
      state.steps[step].subStep[subStep].error = error;
    },

    resetStep(
      state,
      action: PayloadAction<{
        step: WorkflowStepKey;
      }>
    ) {
      const { step } = action.payload;
      const subStepKeys = Object.keys(state.steps[step].subStep);
      state.steps[step] = createStep(subStepKeys);
    },

    resetAll: () => initialState,
  },
});

export const {
  setActiveStep,
  nextStep,
  setStepLocked,
  setStepAcknowledged,
  setStepStatus,
  setSubStepStatus,
  setSubStepError,
  resetStep,
  resetAll,
} = workflowSlice.actions;

export default workflowSlice.reducer;

export const selectStep = (
  state: { workflow: WorkflowState },
  step: WorkflowStepKey
) => state.workflow.steps[step];

export const selectSubStep = (
  state: { workflow: WorkflowState },
  step: WorkflowStepKey,
  subStep: string
) => state.workflow.steps[step].subStep[subStep];

export const selectActiveStep = (state: { workflow: WorkflowState }) =>
  state.workflow.steps[state.workflow.activeStep];
