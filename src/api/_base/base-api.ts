import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from '@/api/_base/base-api-reauth'

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'Me',
    'Profile',
    'ProfileMetrics',
    'PublicProfile',
    'Posts',
    'PostsFollowing',
    'CountryCatalog',
    'Notifications',
    'Comments',
    'Answers',
    'Chats',
    'Messages',
    'UserPosts',
    'PublicPosts',
    'PublicPosts',
    'ProfileMetrics',
  ],
  endpoints: builder => ({}),
})

export const {} = baseApi
