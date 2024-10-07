import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from '@/api/base-api-reauth'

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Me', 'Profile'],
  endpoints: builder => ({}),
})

export const {} = baseApi
