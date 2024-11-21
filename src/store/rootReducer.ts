import { combineReducers } from '@reduxjs/toolkit';
import assessmentInfoReducer from '@/store/features/assessmentInfoSlice';

export const rootReducer = combineReducers({
  assessmentInfo: assessmentInfoReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
