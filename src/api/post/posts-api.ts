import { baseApi } from '@/api/_base/base-api'
import {
  AddUserPostsArgs,
  ApiResponse,
  GetPublicPostsArgs,
  GetPublicPostsResponse,
  GetUserPostsArgs,
  GetUserPostsResponse,
  PostsFollowingParams,
  ResPostsFollowing,
  ToggleLikePostArgs,
  UpdateUserPostArgs,
  UpdateUserPostResponse,
  // Убедитесь, что Like импортируется, если он в отдельном файле
} from './posts-api.types'

export const postsApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getUserPosts: builder.query<GetUserPostsResponse, GetUserPostsArgs>({
      query: ({ userId, pageNumber = 1, pageSize = 8 }) =>
        `v1/posts/${userId}?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      providesTags: result =>
        result
          ? [
              { type: 'Posts', id: 'LIST_FOLLOWING' },
              ...result.items.map(({ id }) => ({ type: 'Posts' as const, id })),
            ]
          : [{ type: 'Posts', id: 'LIST_FOLLOWING' }],
    }),

    getPostsFollowing: builder.query<ResPostsFollowing, PostsFollowingParams>({
      query: ({ endCursorPostId = '', pageSize = 8, sortBy, sortDirection }) => ({
        url: `v1/following/posts/${endCursorPostId}`,
        params: { pageSize, sortBy, sortDirection },
      }),

      serializeQueryArgs: () => 'LIST_FOLLOWING',

      merge: (currentCache, newItems, { arg }) => {
        if (!arg.endCursorPostId || arg.endCursorPostId === '') {
          return newItems
        }

        const existingIds = new Set(currentCache.items.map(item => item.id))
        const uniqueNewItems = newItems.items.filter(item => !existingIds.has(item.id))

        return {
          ...newItems,
          items: [...currentCache.items, ...uniqueNewItems],
          totalCount: newItems.totalCount,
          pageNumber: newItems.pageNumber,
          pagesCount: newItems.pagesCount,
          pageSize: newItems.pageSize,
        }
      },

      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.endCursorPostId !== previousArg?.endCursorPostId
      },

      providesTags: result =>
        result
          ? [
              { type: 'Posts', id: 'LIST_FOLLOWING' },
              ...result.items.map(({ id }) => ({ type: 'Posts' as const, id })),
            ]
          : [{ type: 'Posts', id: 'LIST_FOLLOWING' }],
    }),

    addUserPosts: builder.mutation<ApiResponse, AddUserPostsArgs>({
      query: ({ files, description }) => {
        const formData = new FormData()
        files.forEach(file => formData.append('files', file))
        formData.append('description', description)
        return {
          url: 'v1/posts',
          method: 'POST',
          body: formData,
        }
      },
      invalidatesTags: ['Posts', { type: 'Posts', id: 'LIST_FOLLOWING' }],
    }),

    updateUserPost: builder.mutation<UpdateUserPostResponse, UpdateUserPostArgs>({
      query: ({ postId, description }) => ({
        url: `v1/posts/${postId}`,
        method: 'PUT',
        body: { description },
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: 'Posts', id: postId },
        { type: 'Posts', id: 'LIST_FOLLOWING' },
      ],
    }),

    deleteUserPost: builder.mutation<ApiResponse, { postId: string }>({
      query: ({ postId }) => ({
        url: `v1/posts/${postId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: 'Posts', id: postId },
        { type: 'Posts', id: 'LIST_FOLLOWING' },
      ],
    }),

    getPublicPosts: builder.query<GetPublicPostsResponse, GetPublicPostsArgs>({
      query: ({ endCursorPostId, pageSize, sortBy, sortDirection }) =>
        `v1/public-posts/all/${endCursorPostId}?pageSize=${pageSize}&sortBy=${sortBy}&sortDirection=${sortDirection}`,
      providesTags: ['Posts'],
    }),

    toggleLikePost: builder.mutation<void, ToggleLikePostArgs>({
      query: ({ postId, status }) => {
        return {
          url: `/v1/posts/like/${postId}`,
          method: 'PUT',
          body: {
            status: status,
          },
        }
      },
      invalidatesTags: (result, error, { postId }) => [
        { type: 'Posts', id: postId },
        { type: 'Posts', id: 'LIST_FOLLOWING' },
      ],
    }),
  }),
})

export const {
  useGetUserPostsQuery,
  useAddUserPostsMutation,
  useUpdateUserPostMutation,
  useDeleteUserPostMutation,
  useGetPostsFollowingQuery,
  useGetPublicPostsQuery,
  useToggleLikePostMutation,
} = postsApi
