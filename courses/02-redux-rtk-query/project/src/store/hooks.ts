import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './store'

// Typed wrappers around react-redux's hooks: useAppSelector reads state produced by
// the root reducer, and useAppDispatch sends actions through the store's middleware.
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()