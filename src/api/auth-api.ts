import { baseApi } from '@/api/base-api'

export const authApi = baseApi.injectEndpoints({
  endpoints: builder => {
    return {
      google: builder.query<any, void>({
        query: () => `v1/auth/google`,
      }),
      googleCallback: builder.query<any, void>({
        query: () => `v1/auth/google/callback`,
      }),
      github: builder.query<any, void>({
        query: () => `v1/auth/github`,
      }),
      registration: builder.mutation<registrationRequestType, registrationArgs>({
        query: body => {
          return {
            url: 'v1/auth/registration',
            method: 'POST',
            body,
          }
        },
      }),
    }
  },
})

export const { useGoogleQuery, useGoogleCallbackQuery, useGithubQuery, useRegistrationMutation } =
  authApi

type registrationRequestType = {
  statusCode: number
  message: string
}

type registrationArgs = {
  username: string
  email: string
  password: string
  html: string
}
