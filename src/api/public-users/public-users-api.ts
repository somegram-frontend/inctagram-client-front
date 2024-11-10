import { baseApi } from '@/api/_base/base-api'
import { GetTotalCountResponse } from './public-users-api.types'

export const publicUsersApi = baseApi.injectEndpoints({
  endpoints: builder => {
    return {
      getTotalCount: builder.query<GetTotalCountResponse, void>({
        query: () => '/v1/public-users',
      }),
    }
  },
})

export const {
  useGetTotalCountQuery,
  util: { getRunningQueriesThunk },
} = publicUsersApi

export const { getTotalCount } = publicUsersApi.endpoints
