import { fetchBaseQuery, FetchBaseQueryMeta } from '@reduxjs/toolkit/query'
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { Mutex } from 'async-mutex'
import Router from 'next/router'

// create a new mutex
const mutex = new Mutex()
const baseQuery = fetchBaseQuery({
  baseUrl: 'https://somegram.online/api',
  prepareHeaders: headers => {
    const token = localStorage.getItem('token')
    headers.set('Authorization', `Bearer ${token}`)
    return headers
  },
})
export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // wait until the mutex is available without locking it
  await mutex.waitForUnlock()
  let result = await baseQuery(args, api, extraOptions)
  if (result.error && result.error.status === 401) {
    // checking whether the mutex is locked
    if (!mutex.isLocked()) {
      const release = await mutex.acquire()
      try {
        const refreshResult = (await baseQuery(
          {
            url: '/v1/auth/refresh-token',
            method: 'POST',
            credentials: 'include',
          },
          api,
          extraOptions
        )) as QueryReturnValue<UpdateAccessTokenResponse, FetchBaseQueryError, FetchBaseQueryMeta>
        if (refreshResult.data) {
          localStorage.setItem('token', refreshResult.data.accessToken)
          // retry the initial query
          result = await baseQuery(args, api, extraOptions)
        } else {
          console.log('logged out')
          Router.push('auth/login')
        }
      } finally {
        // release must be called once the mutex should be released again.
        release()
      }
    } else {
      // wait until the mutex is available without locking it
      await mutex.waitForUnlock()
      result = await baseQuery(args, api, extraOptions)
    }
  }
  return result
}

type UpdateAccessTokenResponse = {
  userId?: number
  accessToken: string
  refreshToken?: string
}

type QueryReturnValue<T = unknown, E = unknown, M = unknown> =
  | {
      error: E
      data?: undefined
      meta?: M
    }
  | {
      error?: undefined
      data: T
      meta?: M
    }
