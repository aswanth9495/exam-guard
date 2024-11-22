import { combineReducers } from '@reduxjs/toolkit';
import assessmentInfoReducer from '@/store/features/assessmentInfoSlice';
import workflowReducer from '@/store/features/workflowSlice';

export const rootReducer = combineReducers({
  assessmentInfo: assessmentInfoReducer,
  workflow: workflowReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
