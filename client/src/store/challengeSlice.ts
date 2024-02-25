// src/store/challengeSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ChallengeState {
  challengeName: string;
  goalMoney: number;
  date: Date | null;
  term: string;
  isPublic: boolean;
  topic: string;
  authTerm: string;
  authStart: string;
  authEnd: string;
  save: boolean;
}

const initialState: ChallengeState = {
  challengeName: '',
  goalMoney: 0,
  date: null,
  term: '',
  isPublic: false,
  topic: '',
  authTerm: '',
  authStart: '',
  authEnd: '',
  save: false,
};

export const challengeSlice = createSlice({
  name: 'challenge',
  initialState,
  reducers: {
    setSliceChallengeName: (state, action: PayloadAction<string>) => {
      state.challengeName = action.payload;
    },
    setSliceGoalMoney: (state, action: PayloadAction<number>) => {
      state.goalMoney = action.payload;
    },
    setSliceDate: (state, action: PayloadAction<Date | null>) => {
      state.date = action.payload;
    },
    setSliceTerm: (state, action: PayloadAction<string>) => {
      state.term = action.payload;
    },
    setSliceIsPublic: (state, action: PayloadAction<boolean>) => {
      state.isPublic = action.payload;
    },
    setSliceTopic: (state, action: PayloadAction<string>) => {
      state.topic = action.payload;
    },
    setSliceAuthTerm: (state, action: PayloadAction<string>) => {
      state.authTerm = action.payload;
    },
    setSliceAuthStart: (state, action: PayloadAction<string>) => {
      state.authStart = action.payload;
    },
    setSliceAuthEnd: (state, action: PayloadAction<string>) => {
      state.authEnd = action.payload;
    },
    setSave: (state, action: PayloadAction<boolean>) => {
      state.save = action.payload;
    },
  },
});

export const {
  setSliceChallengeName,
  setSliceGoalMoney,
  setSliceDate,
  setSliceTerm,
  setSliceIsPublic,
  setSliceTopic,
  setSliceAuthTerm,
  setSliceAuthStart,
  setSliceAuthEnd,
  setSave,
} = challengeSlice.actions;

export default challengeSlice.reducer;
