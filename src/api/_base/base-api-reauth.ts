import { EnumTokens } from '@/shared/const/enums'
import { fetchBaseQuery, FetchBaseQueryMeta } from '@reduxjs/toolkit/query'
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { Mutex } from 'async-mutex'

const mutex = new Mutex()

const ENDPOINTS_REQUIRING_CREDENTIALS = [
  'v1/public-posts',
  '/v1/public-posts',
  '/v1/public-posts/all',
  '/v1/public-posts/all/',
  '/v1/public-posts/comments/',
]

function shouldUseCredentials(url: string): boolean {
  console.log('Checking URL:', url) // добавить это
  const result = ENDPOINTS_REQUIRING_CREDENTIALS.some(endpoint => url.includes(endpoint))
  console.log('Should use credentials:', result) // и это
  return result
}

const baseQuery = fetchBaseQuery({
  baseUrl: 'https://somegram.online/api',
  prepareHeaders: headers => {
    const token = localStorage.getItem(EnumTokens.ACCESS_TOKEN)
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    return headers
  },
})

const baseQueryWithCredentials = fetchBaseQuery({
  baseUrl: 'https://somegram.online/api',
  credentials: 'include',
  prepareHeaders: headers => {
    const token = localStorage.getItem(EnumTokens.ACCESS_TOKEN)
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    return headers
  },
})

const refreshBaseQuery = fetchBaseQuery({
  baseUrl: 'https://somegram.online/api',
  credentials: 'include',
})

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock()

  const requestUrl = typeof args === 'string' ? args : args.url || ''

  const queryToUse = shouldUseCredentials(requestUrl) ? baseQueryWithCredentials : baseQuery

  let result = await queryToUse(args, api, extraOptions)

  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire()
      try {
        const refreshResult = (await refreshBaseQuery(
          {
            url: '/v1/auth/refresh-token',
            method: 'POST',
          },
          api,
          extraOptions,
        )) as QueryReturnValue<UpdateAccessTokenResponse, FetchBaseQueryError, FetchBaseQueryMeta>

        if (refreshResult.data) {
          localStorage.setItem(EnumTokens.ACCESS_TOKEN, refreshResult.data.accessToken)

          result = await queryToUse(args, api, extraOptions)
        } else {
          // void Router.push('/auth/signIn')
          // есть на проекте AuthGuard который выполняет эту функцию редиректа
          console.error('Failed to refresh token:', refreshResult.error)
        }
      } finally {
        release()
      }
    } else {
      await mutex.waitForUnlock()
      result = await queryToUse(args, api, extraOptions)
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
