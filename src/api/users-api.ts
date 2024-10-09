import { baseApi } from '@/api/base-api'
import { GetProfileSuccess, UploadAvatarResponse, UserProfile } from './users-api.types'

export const usersApi = baseApi.injectEndpoints({
  endpoints: builder => {
    return {
      getProfile: builder.query<GetProfileSuccess, void>({
        query: () => `v1/users/profile-info`,
        providesTags: ['Profile'],
      }),
      uploadAvatar: builder.mutation<UploadAvatarResponse, { file: File }>({
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
      profileFillInfo: builder.mutation<void, UserProfile>({
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
  useUploadAvatarMutation,
  useGetProfileQuery,
  useDeleteAvatarMutation,
  useProfileFillInfoMutation,
} = usersApi
