import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  title: '',
  backPath: '',
};

export const headerSlice = createSlice({
  name: 'header',
  initialState,
  reducers: {
    setHeaderInfo: (state, action) => {
      state.title = action.payload.title;
      state.backPath = action.payload.backPath;
    },
  },
});

export const { setHeaderInfo } = headerSlice.actions;

export default headerSlice.reducer;
