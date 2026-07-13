import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from '../api/apiSlice'
// ...other slice imports

export const store = configureStore({
  reducer: {
    // ...other reducers
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch