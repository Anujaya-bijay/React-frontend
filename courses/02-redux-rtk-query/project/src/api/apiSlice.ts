import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { mockApi, type User, type Post } from './mockServer';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  tagTypes: ['User', 'Post'],
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      queryFn: async () => {
        try {
          const users = await mockApi.getUsers();
          return { data: users };
        } catch (error: unknown) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error instanceof Error ? error.message : 'Failed to fetch users',
            },
          };
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'User' as const, id })),
              { type: 'User' as const, id: 'LIST' },
            ]
          : [{ type: 'User' as const, id: 'LIST' }],
    }),

    addUser: builder.mutation<User, Omit<User, 'id'>>({
      queryFn: async (newUser) => {
        try {
          const user = await mockApi.createUser(newUser);
          return { data: user };
        } catch (error: unknown) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error instanceof Error ? error.message : 'Failed to add user',
            },
          };
        }
      },
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),

    getPosts: builder.query<Post[], void>({
      queryFn: async () => {
        try {
          const posts = await mockApi.getPosts();
          return { data: posts };
        } catch (error: unknown) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error instanceof Error ? error.message : 'Failed to fetch posts',
            },
          };
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Post' as const, id })),
              { type: 'Post' as const, id: 'LIST' },
            ]
          : [{ type: 'Post' as const, id: 'LIST' }],
    }),

    addPost: builder.mutation<Post, Omit<Post, 'id'>>({
      queryFn: async (newPost) => {
        try {
          const post = await mockApi.createPost(newPost);
          return { data: post };
        } catch (error: unknown) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error instanceof Error ? error.message : 'Failed to add post',
            },
          };
        }
      },
      async onQueryStarted(newPost, { dispatch, queryFulfilled }) {
        // Optimistically add the new post to the getPosts cache immediately,
        // using a temporary id until the server responds with the real one.
        const patchResult = dispatch(
          apiSlice.util.updateQueryData('getPosts', undefined, (draft) => {
            draft.push({ ...newPost, id: Date.now() });
          })
        );

        try {
          await queryFulfilled;
        } catch {
          // Server rejected the mutation — roll back the optimistic patch.
          patchResult.undo();
        }
      },
      invalidatesTags: [{ type: 'Post', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useAddUserMutation,
  useGetPostsQuery,
  useAddPostMutation,
} = apiSlice;