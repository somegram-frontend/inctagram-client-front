import { baseApi } from '@/api/base-api'
import {
  AddUserPostsArgs,
  AddUserPostsResponse,
  GetUserPostsArgs,
  GetUserPostsResponse,
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
      addUserPosts: builder.mutation<AddUserPostsResponse, AddUserPostsArgs>({
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
    }
  },
})

export const { useGetUserPostsQuery, useAddUserPostsMutation, useUpdateUserPostMutation } = postsApi
