import { baseApi } from '@/api/base-api'
import { AddUserPostsResponse, GetUserPostsArgs, GetUserPostsResponse } from './posts-api.types'

export const authApi = baseApi.injectEndpoints({
  endpoints: builder => {
    return {
      getUserPosts: builder.query<GetUserPostsResponse, GetUserPostsArgs>({
        query: userId => `v1/posts/${userId}`,
        providesTags: ['Profile'],
      }),
      addUserPosts: builder.mutation<AddUserPostsResponse, { files: File[]; description: string }>({
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
    }
  },
})

export const { useGetUserPostsQuery, useAddUserPostsMutation } = authApi
