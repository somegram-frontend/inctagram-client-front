import { baseApi } from '@/api/base-api'
import { GetUserPostsArgs, GetUserPostsResponse } from './posts-api.types'

export const authApi = baseApi.injectEndpoints({
  endpoints: builder => {
    return {
      getUserPosts: builder.query<GetUserPostsResponse, GetUserPostsArgs>({
        query: ({ userId, pageNumber, pageSize }) =>
          `v1/posts/${userId}?pageNumber=${pageNumber}&pageSize=${pageSize}`,
        providesTags: ['Posts'],
      }),
    }
  },
})

export const { useGetUserPostsQuery } = authApi
