import {baseApi} from '@/api/_base/base-api'
import {ResNotifications} from "@/api/notifications/notifications-api.types";

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: builder => {
    return {
      reedNotifications: builder.mutation<void, { notificationId: string }>({
        query: ({notificationId}) => {
          return {
            url: '/v1/notifications/read',
            method: 'PUT',
            params: {notificationId},
          }
        },
      }),
      getNotifications: builder.query<ResNotifications, void>({
        query: () => ({url: '/v1/notifications'}),
      }),
    }
  },
})

export const {useGetNotificationsQuery, useReedNotificationsMutation} = notificationsApi
