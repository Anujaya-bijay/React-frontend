import { createSlice } from '@reduxjs/toolkit'

// Actions dispatched from this slice flow through the store's middleware pipeline
const initialState: number = 0

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => state + 1,
    decrement: (state) => state - 1,
  },
})

export const { increment, decrement } = counterSlice.actions
export default counterSlice.reducer