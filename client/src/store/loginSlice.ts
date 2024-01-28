import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LoginState {
  isLoggedIn: boolean;
  userid_num: number;
  nickname: string;
  accessToken: string;
  refreshToken: string;
}

const initialState: LoginState = {
  isLoggedIn: false,
  userid_num: 0,
  nickname: '',
  accessToken: '',
  refreshToken: '',
};

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setIsLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    },
    setNickname: (state, action: PayloadAction<string>) => {
      state.nickname = action.payload;
    },
    setUserid_num: (state, action: PayloadAction<number>) => {
      state.userid_num = action.payload;
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    setRefreshToken: (state, action: PayloadAction<string>) => {
      state.refreshToken = action.payload;
    },
  },
});

export const { setIsLoggedIn, setNickname, setUserid_num, setAccessToken, setRefreshToken } = loginSlice.actions;
export default loginSlice.reducer;
