import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

// Note: this slice exports a reducer: (the default export below) that gets
// registered in src/store/store.ts. It requires no middleware: of its own —
// only sync state updates — unlike apiSlice, which needs RTK Query's middleware.
export type SortOrder = 'newest' | 'oldest'

export interface FiltersState {
  sortBy: SortOrder
  filterUserId: number | null
}

const initialState: FiltersState = {
  sortBy: 'newest',
  filterUserId: null,
}

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSortBy(state, action: PayloadAction<SortOrder>) {
      state.sortBy = action.payload
    },
    setFilterUserId(state, action: PayloadAction<number | null>) {
      state.filterUserId = action.payload
    },
    resetFilters(state) {
      state.sortBy = initialState.sortBy
      state.filterUserId = initialState.filterUserId
    },
  },
})

export const { setSortBy, setFilterUserId, resetFilters } = filtersSlice.actions
export default filtersSlice.reducer