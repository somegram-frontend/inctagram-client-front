import { baseApi } from '@/api/_base/base-api'
import {
  GetProfileSuccess,
  GetPublicProfileSuccess,
  ProfileResponse,
  UserProfile,
} from './users-api.types'

export const usersApi = baseApi.injectEndpoints({
  endpoints: builder => {
    return {
      getProfile: builder.query<GetProfileSuccess, void>({
        query: () => `v1/users/profile-info`,
        providesTags: ['Profile'],
      }),
      getPublicProfile: builder.query<GetPublicProfileSuccess, { id: string }>({
        query: ({ id }) => `v1/public-users/profile/${id}`,
        providesTags: ['PublicProfile'],
      }),
      uploadAvatar: builder.mutation<ProfileResponse, { file: File }>({
        query: ({ file }) => {
          const formData = new FormData()
          formData.append('file', file)

          return {
            url: `v1/users/profile-upload-avatar`,
            method: 'POST',
            body: formData,
          }
        },
        invalidatesTags: ['Profile'],
      }),
      deleteAvatar: builder.mutation<void, void>({
        query: () => {
          return {
            url: 'v1/users/profile-delete-avatar',
            method: 'DELETE',
          }
        },
        invalidatesTags: ['Profile'],
      }),
      profileFillInfo: builder.mutation<ProfileResponse, UserProfile>({
        query: data => ({
          url: `v1/users/profile-fill-info`,
          method: 'PUT',
          body: data,
        }),
        invalidatesTags: ['Profile'],
      }),
    }
  },
})

export const {
  useGetProfileQuery,
  useGetPublicProfileQuery,
  useUploadAvatarMutation,
  useDeleteAvatarMutation,
  useProfileFillInfoMutation,
} = usersApi
