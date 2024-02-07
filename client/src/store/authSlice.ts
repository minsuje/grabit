import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { RootState } from './store';

export interface AuthState {
  userid: string;
  access_token: string;
  refresh_token: string;
}

const initialState: AuthState = {
  userid: '',
  access_token: '',
  refresh_token: '',
};

export const authSlice = createSlice({
  name: 'authSlice',
  initialState,
  reducers: {
    setAuthenticatedUser: (state: AuthState, { payload }: PayloadAction<AuthState>) => {
      state.userid = payload.userid;
      state.access_token = payload.access_token;
      state.refresh_token = payload.refresh_token;
    },
    resetState: (state: AuthState) => {
      state.userid = '';
      state.access_token = '';
      state.refresh_token = '';
      localStorage.setItem('user', '');
    },
  },
});

export const { setAuthenticatedUser, resetState } = authSlice.actions;
export const authReducer = authSlice.reducer;
// export const selectAuthenticatedUser = (state: RootState) => state.authReducer;
