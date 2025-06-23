import { baseApi } from '@/api/_base/base-api'
import {
  GetProfileMetricsSuccess,
  GetProfileSuccess,
  GetPublicProfileSuccess,
  GetTotalCountResponse,
  GetUserProfileSuccess,
  GetUsersResponse,
  ProfileResponse,
  UserProfile,
} from './users-api.types'
// deploy
export const usersApi = baseApi.injectEndpoints({
  endpoints: builder => {
    return {
      getProfile: builder.query<GetProfileSuccess, void>({
        query: () => `v1/users/profile-info`,
        providesTags: ['Profile'],
      }),
      getProfileMetrics: builder.query<GetProfileMetricsSuccess, { userId: string }>({
        query: ({ userId }) => `/v1/users/${userId}/profile`,
        providesTags: ['ProfileMetrics'],
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
      getTotalUsersCount: builder.query<GetTotalCountResponse, void>({
        query: () => '/v1/public-users',
      }),
      getUsers: builder.query<
        GetUsersResponse,
        { endCursorUserId?: string; search?: string; pageSize?: number; pageNumber?: number }
      >({
        query: ({ endCursorUserId, search, pageSize = 10, pageNumber = 1 }) => {
          let url = `v1/users/${
            endCursorUserId ?? ''
          }?pageSize=${pageSize}&pageNumber=${pageNumber}`
          if (search) url += `&search=${encodeURIComponent(search)}`

          return {
            url,
            method: 'GET',
          }
        },
      }),
      getUserProfile: builder.query<GetUserProfileSuccess, { userId: string }>({
        query: ({ userId }) => `v1/users/${userId}/profile`,
        providesTags: ['PublicProfile'],
      }),
      followUser: builder.mutation<void, string>({
        query: followeeId => ({
          url: `v1/users/follow/${followeeId}`,
          method: 'POST',
        }),
        invalidatesTags: ['PublicProfile', 'Posts', 'PublicPosts'],
      }),
      unfollowUser: builder.mutation<void, string>({
        query: followeeId => ({
          url: `v1/users/unfollow/${followeeId}`,
          method: 'POST',
        }),
        invalidatesTags: ['PublicProfile', 'Posts', 'PublicPosts'],
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
  useGetUsersQuery,
  useGetUserProfileQuery,
  useFollowUserMutation,
  useUnfollowUserMutation,
  useGetProfileMetricsQuery,
  useGetTotalUsersCountQuery,
} = usersApi
