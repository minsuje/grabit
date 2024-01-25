import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Friend } from '@/types/types';

interface FriendState {
  selectedFriends: Friend[];
}

const initialState: FriendState = {
  selectedFriends: [],
};

export const friendSlice = createSlice({
  name: 'friend',
  initialState,
  reducers: {
    addFriend: (state, action: PayloadAction<Friend>) => {
      const friendExists = state.selectedFriends.some((friend) => friend.id === action.payload.id);
      if (!friendExists) {
        state.selectedFriends.push(action.payload);
      }
    },
    removeFriend: (state, action: PayloadAction<Friend>) => {
      state.selectedFriends = state.selectedFriends.filter((friend) => friend.id !== action.payload.id);
    },
  },
});

export const { addFriend, removeFriend } = friendSlice.actions;
export default friendSlice.reducer;
