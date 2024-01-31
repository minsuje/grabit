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
}

const initialState: ResultState = {
  totalAuth: 10,
  result: [
    { userid_num: 1, nickname: '닉1', Authcount: 5 },
    { userid_num: 2, nickname: '닉2', Authcount: 10 },
  ],
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
  },
});

export const { setTotalAuth, setResult } = resultSlice.actions;

export default resultSlice.reducer;
