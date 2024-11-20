import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from '@/api/_base/base-api-reauth'

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Me', 'Profile', 'PublicProfile', 'Posts'],
  endpoints: builder => ({}),
})

export const {} = baseApi
