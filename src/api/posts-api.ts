import { baseApi } from '@/api/base-api'
import { AddUserPostsArgs, AddUserPostsResponse, GetUserPostsArgs, GetUserPostsResponse } from './posts-api.types'
import { ProfileResponse } from './users-api.types'

export const authApi = baseApi.injectEndpoints({
  endpoints: builder => {
    return {
      getUserPosts: builder.query<GetUserPostsResponse, GetUserPostsArgs>({
        query: userId => `v1/posts/${userId}`,
        providesTags: ['Profile'],
      }),
      addUserPosts: builder.mutation<AddUserPostsResponse, AddUserPostsArgs>({
        query: body => {
          return {
            url: 'v1/posts',
            method: 'POST',
            body,
          }
        }
      }),
      addPhotoForPost: builder.mutation<ProfileResponse, { file: File }>({
        query: ({ file }) => {
          const formData = new FormData()
          formData.append('file', file)
          return {
            url: '/api/v1/posts/photo',
            method: 'POST',
            body: formData,
          }
        }
      })
    }
  },
})

export const {
  useGetUserPostsQuery,
  useAddUserPostsMutation,
  useAddPhotoForPostMutation
} = authApi
