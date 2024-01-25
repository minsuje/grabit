import { configureStore } from '@reduxjs/toolkit';
import friendReducer from './friendSlice';
import challengeReducer from './challengeSlice';

export const store = configureStore({
  reducer: {
    friend: friendReducer,
    challenge: challengeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
