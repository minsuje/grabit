import { configureStore } from '@reduxjs/toolkit';
import friendReducer from './friendSlice';
import challengeReducer from './challengeSlice';
import loginReducer from './loginSlice';
import headerReducer from './headerSlice';
import resultReducer from './resultSlice';
import { authReducer } from './authSlice';
import { authAPI } from '@/services/auth.service';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'result',
  storage,
  whitelist: ['result'],
};

const reducers = combineReducers({
  friend: friendReducer,
  challenge: challengeReducer,
  login: loginReducer,
  header: headerReducer,
  auth: authReducer,
  result: resultReducer,
  [authAPI.reducerPath]: authAPI.reducer,
});
const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }).concat([authAPI.middleware]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
