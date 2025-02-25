import { baseApi } from '@/api/_base/base-api'
import { ResNotifications } from '@/api/notifications/notifications-api.types'

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: builder => {
    return {
      reedNotifications: builder.mutation<void, { notificationId: string }>({
        invalidatesTags: ['Notifications'],
        query: ({ notificationId }) => {
          return {
            url: `/v1/notifications/read/${notificationId}`,
            method: 'PUT',
          }
        },
      }),
      getNotifications: builder.query<ResNotifications[], void>({
        providesTags: ['Notifications'],
        query: () => ({ url: '/v1/notifications' }),
      }),
    }
  },
})

export const { useGetNotificationsQuery, useReedNotificationsMutation } = notificationsApi
