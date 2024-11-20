import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state = {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
