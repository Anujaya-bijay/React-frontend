import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { mockApi } from '../mockApi' // adjust path to wherever your mock API lives

export interface User {
  id: number
  name: string
  email: string
}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      queryFn: async () => {
        try {
          const data = await mockApi.getUsers()
          return { data }
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: String(error) } }
        }
      },
    }),
  }),
})

export const { useGetUsersQuery } = apiSlice