import { configureStore } from '@reduxjs/toolkit';
import friendReducer from './friendSlice';
import challengeReducer from './challengeSlice';
import loginReducer from './loginSlice';
import headerReducer from './headerSlice';

export const store = configureStore({
  reducer: {
    friend: friendReducer,
    challenge: challengeReducer,
    login: loginReducer,
    header: headerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
