import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LoginState {
  isLoggedIn: boolean;
  username: string;
  userId: number;
  loginToken: string;
  refreshToken: string;
}

const initialState: LoginState = {
  isLoggedIn: false,
  username: '',
  userId: 0,
  loginToken: '',
  refreshToken: '',
};

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setIsLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    },
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    setUserId: (state, action: PayloadAction<number>) => {
      state.userId = action.payload;
    },
    setLoginToken: (state, action: PayloadAction<string>) => {
      state.loginToken = action.payload;
    },
    setRefreshToken: (state, action: PayloadAction<string>) => {
      state.refreshToken = action.payload;
    },
  },
});

export const { setIsLoggedIn, setUsername, setUserId, setLoginToken, setRefreshToken } = loginSlice.actions;
export default loginSlice.reducer;
