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
} from './posts-api.types'

export const postsApi = baseApi.injectEndpoints({
  endpoints: builder => {
    return {
      getUserPosts: builder.query<GetUserPostsResponse, GetUserPostsArgs>({
        query: ({ userId, pageNumber, pageSize }) =>
          `v1/posts/${userId}?pageNumber=${pageNumber}&pageSize=${pageSize}`,
        providesTags: ['Posts'],
      }),
      getPostsFollowing: builder.query<ResPostsFollowing, PostsFollowingParams>({
        query: ({ endCursorPostId, ...params }) => ({
          url: `v1/following/posts/${endCursorPostId}`,
          params,
        }),

        providesTags: ['Posts'],
      }),
      toggleLikePost: builder.mutation<void, ToggleLikePostArgs>({
        query: ({ postId, status }) => {
          return {
            url: `/v1/posts/like/${postId}`,
            method: 'PUT',
            body: { status },
          }
        },
        invalidatesTags: ['Posts'],
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
        invalidatesTags: ['Posts'],
      }),
      updateUserPost: builder.mutation<UpdateUserPostResponse, UpdateUserPostArgs>({
        query: ({ postId, description }) => {
          return {
            url: `v1/posts/${postId}`,
            method: 'PUT',
            body: { description },
          }
        },
        invalidatesTags: ['Posts'],
      }),
      deleteUserPost: builder.mutation<ApiResponse, { postId: string }>({
        query: ({ postId }) => {
          return {
            url: `v1/posts/${postId}`,
            method: 'DELETE',
          }
        },
        invalidatesTags: ['Posts'],
      }),
      getPublicPosts: builder.query<GetPublicPostsResponse, GetPublicPostsArgs>({
        query: ({ endCursorPostId, pageSize, sortBy, sortDirection }) =>
          `v1/public-posts/all/${endCursorPostId}?pageSize=${pageSize}&sortBy=${sortBy}&sortDirection=${sortDirection}`,
      }),
    }
  },
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
