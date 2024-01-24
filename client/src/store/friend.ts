import { createSlice, configureStore } from '@reduxjs/toolkit';

export const friendSlice = createSlice({
    name: 'friend',
    initialState: [],
    reducers: {
        updateFriend(state, action) {
            const { data } = action.payload;
            state = { ...state, ...data };
        },
    },
});

const store = configureStore({
    reducer: friendSlice.reducer,
});

export default store;
