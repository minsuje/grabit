// src/store/resultSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
interface challengers {
  userid_num: number;
  nickname: string;
  Authcount: number;
}
interface ResultState {
  totalAuth: number;
  result: challengers[];
  winner: number[];
}

const initialState: ResultState = {
  totalAuth: 10,
  result: [
    { userid_num: 1, nickname: '닉1', Authcount: 5 },
    { userid_num: 2, nickname: '닉2', Authcount: 10 },
  ],
  winner: [], // 최종 승자 유저 아이디 배열
};

export const resultSlice = createSlice({
  name: 'challengeResult',
  initialState,
  reducers: {
    setTotalAuth: (state, action: PayloadAction<number>) => {
      state.totalAuth = action.payload;
    },
    setResult: (state, action: PayloadAction<challengers[]>) => {
      state.result = action.payload;
    },
    setWinner: (state, action: PayloadAction<number[]>) => {
      state.winner = action.payload;
    },
  },
});

export const { setTotalAuth, setResult, setWinner } = resultSlice.actions;

export default resultSlice.reducer;
