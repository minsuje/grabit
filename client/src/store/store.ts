import { configureStore } from '@reduxjs/toolkit';
import friendReducer from './friendSlice';
import challengeReducer from './challengeSlice';
import loginReducer from './loginSlice';

export const store = configureStore({
  reducer: {
    friend: friendReducer,
    challenge: challengeReducer,
    login: loginReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
