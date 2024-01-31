import { configureStore } from '@reduxjs/toolkit';
import friendReducer from './friendSlice';
import challengeReducer from './challengeSlice';
import loginReducer from './loginSlice';
import headerReducer from './headerSlice';
import resultReducer from './resultSlice'
import { authReducer } from './authSlice';
import { authAPI } from '@/services/auth.service';

export const store = configureStore({
  reducer: {
    friend: friendReducer,
    challenge: challengeReducer,
    login: loginReducer,
    header: headerReducer,
    auth: authReducer,
    result: resultReducer,
    [authAPI.reducerPath]: authAPI.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([authAPI.middleware]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
