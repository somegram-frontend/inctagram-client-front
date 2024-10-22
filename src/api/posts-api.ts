import { baseApi } from '@/api/base-api'
import {
  GetUserPostsArgs,
  GetUserPostsResponse,
  UpdateUserPostArgs,
  UpdateUserPostResponse,
} from './posts-api.types'

export const authApi = baseApi.injectEndpoints({
  endpoints: builder => {
    return {
      getUserPosts: builder.query<GetUserPostsResponse, GetUserPostsArgs>({
        query: ({ userId, pageNumber, pageSize }) =>
          `v1/posts/${userId}?pageNumber=${pageNumber}&pageSize=${pageSize}`,
        providesTags: ['Posts'],
      }),
      updateUserPost: builder.mutation<UpdateUserPostResponse, UpdateUserPostArgs>({
        query: ({ id, description }) => {
          return {
            url: `v1/posts/${id}`,
            method: 'PUT',
            body: description,
          }
        },
      }),
    }
  },
})

export const { useGetUserPostsQuery, useUpdateUserPostMutation } = authApi
