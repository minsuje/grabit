import { createSlice } from '@reduxjs/toolkit';

export const counterSlice = createSlice({
    name: 'counter',
    initialState: {
        value: 0,
    },
    reducers: {
        increment: (state) => {
            // 리덕스 툴킷을 사용하면 리듀서 내부에 뮤테이팅 로직 작성이 가능하다.
            // 하지만 이것은 실제로 상태를 변형시키는 것이 아니다.
            // Draft state의 변화를 감지하고 그 변화를 기반으로 새오운 불변 상태를 생성하는
            // immer 라이브러리를 사용하기 때문이다.
            state.value += 1;
        },
        decrement: (state) => {
            state.value -= 1;
        },
        incrementByAmount: (state, action) => {
            state.value += action.payload;
        },
    },
});

// 각 케이스 리듀서 함수에 대해 액션 생성자가 생성된다.
export const { increment, decrement, incrementByAmount } = counterSlice.actions;

export default counterSlice.reducer;
