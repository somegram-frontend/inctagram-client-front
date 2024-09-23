import { baseApi } from '@/api/base-api'

export const usersApi = baseApi.injectEndpoints({
  endpoints: builder => {
    return {
      uploadAvatar: builder.mutation<any, { file: File }>({
        query: ({ file }) => {
          const formData = new FormData()
          formData.append('file', file)

          return {
            url: 'v1/users/upload-avatar',
            method: 'POST',
            body: formData,
          }
        },
      }),
    }
  },
})

export const { useUploadAvatarMutation } = usersApi
