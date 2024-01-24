import { configureStore } from '@reduxjs/toolkit';
import friendReducer from './friendSlice';

export const store = configureStore({
  reducer: {
    friend: friendReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
