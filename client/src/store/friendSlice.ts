import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { FriendSelect } from '@/types/types';

interface FriendState {
  selectedFriends: FriendSelect[];
}

const initialState: FriendState = {
  selectedFriends: [],
};

export const friendSlice = createSlice({
  name: 'friend',
  initialState,
  reducers: {
    addFriend: (state, action: PayloadAction<FriendSelect>) => {
      const friendExists = state.selectedFriends.some((friend) => friend.userid_num === action.payload.userid_num);
      if (!friendExists) {
        state.selectedFriends.push(action.payload);
      }
    },
    removeFriend: (state, action: PayloadAction<FriendSelect>) => {
      state.selectedFriends = state.selectedFriends.filter((friend) => friend.userid_num !== action.payload.userid_num);
    },
    resetFriendList: (state) => {
      state.selectedFriends = [];
    },
  },
});

export const { addFriend, removeFriend, resetFriendList } = friendSlice.actions;
export default friendSlice.reducer;
