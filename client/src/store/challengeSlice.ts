// src/store/challengeSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ChallengeState {
  challengeName: string;
  goalMoney: number;
  date: Date | null;
  term: number;
  isPublic: boolean;
  topic: string;
  authTerm: string;
  authStart: string;
  authEnd: string;
}

const initialState: ChallengeState = {
  challengeName: '',
  goalMoney: 0,
  date: null,
  term: 0,
  isPublic: false,
  topic: '',
  authTerm: '',
  authStart: '',
  authEnd: '',
};

export const challengeSlice = createSlice({
  name: 'challenge',
  initialState,
  reducers: {
    setChallengeName: (state, action: PayloadAction<string>) => {
      state.challengeName = action.payload;
    },
    setGoalMoney: (state, action: PayloadAction<number>) => {
      state.goalMoney = action.payload;
    },
    setDate: (state, action: PayloadAction<Date | null>) => {
      state.date = action.payload;
    },
    setTerm: (state, action: PayloadAction<number>) => {
      state.term = action.payload;
    },
    setIsPublic: (state, action: PayloadAction<boolean>) => {
      state.isPublic = action.payload;
    },
    setTopic: (state, action: PayloadAction<string>) => {
      state.topic = action.payload;
    },
    setAuthTerm: (state, action: PayloadAction<string>) => {
      state.authTerm = action.payload;
    },
    setAuthStart: (state, action: PayloadAction<string>) => {
      state.authStart = action.payload;
    },
    setAuthEnd: (state, action: PayloadAction<string>) => {
      state.authEnd = action.payload;
    },
  },
});

export const {
  setChallengeName,
  setGoalMoney,
  setDate,
  setTerm,
  setIsPublic,
  setTopic,
  setAuthTerm,
  setAuthStart,
  setAuthEnd,
} = challengeSlice.actions;

export default challengeSlice.reducer;
