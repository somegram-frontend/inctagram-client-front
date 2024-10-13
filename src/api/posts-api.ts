import { baseApi } from '@/api/base-api'
import { GetUserPostsArgs, GetUserPostsResponse } from './posts-api.types'

export const authApi = baseApi.injectEndpoints({
  endpoints: builder => {
    return {
      getUserPosts: builder.query<GetUserPostsResponse, GetUserPostsArgs>({
        query: userId => `v1/posts/${userId}`,
        providesTags: ['Profile'],
      }),
    }
  },
})

export const { useGetUserPostsQuery } = authApi
