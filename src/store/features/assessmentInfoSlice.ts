import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userName: '',
  assessmentName: '',
};

const assessmentInfoSlice = createSlice({
  name: 'assessmentInfo',
  initialState,
  reducers: {
    setAssessmentInfo: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const { setAssessmentInfo } = assessmentInfoSlice.actions;

export default assessmentInfoSlice.reducer;
