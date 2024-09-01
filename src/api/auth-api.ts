import { baseApi } from '@/api/base-api'
import {
  loginArgs,
  loginResponse,
  registrationArgs,
  registrationConformationArgs,
  registrationErrorResponse422,
  restorePasswordArgs,
  restorePasswordConfirmationArgs,
} from '@/api/auth-api.types'

export const authApi = baseApi.injectEndpoints({
  endpoints: builder => {
    return {
      registration: builder.mutation<any, registrationArgs>({
        query: body => {
          return {
            url: 'v1/auth/registration',
            method: 'POST',
            body,
          }
        },
      }),
      registrationConformation: builder.mutation<any, registrationConformationArgs>({
        query: body => {
          return {
            url: 'v1/auth/registration-confirmation',
            method: 'POST',
            body,
          }
        },
      }),
      google: builder.query<any, void>({
        query: () => `v1/auth/google`,
      }),
      googleCallback: builder.query<any, void>({
        query: () => `v1/auth/google/callback`,
      }),
      recaptchaSiteKey: builder.query<any, void>({
        query: () => `v1/auth/recaptcha-site-key`,
      }),
      restorePassword: builder.mutation<any, restorePasswordArgs>({
        query: body => {
          return {
            url: 'v1/auth/restore-password',
            method: 'POST',
            body,
          }
        },
      }),
      restorePasswordConfirmation: builder.mutation<any, restorePasswordConfirmationArgs>({
        query: body => {
          return {
            url: 'v1/auth/restore-password-confirmation',
            method: 'POST',
            body,
          }
        },
      }),
      login: builder.mutation<loginResponse, loginArgs>({
        query: body => {
          return {
            url: 'v1/auth/login',
            method: 'POST',
            body,
          }
        },
      }),
      logout: builder.mutation<any, void>({
        query: body => {
          return {
            url: 'v1/auth/logout',
            method: 'POST',
            body,
          }
        },
      }),
      refreshToken: builder.mutation<any, void>({
        query: body => {
          return {
            url: 'v1/auth/refresh-token',
            method: 'POST',
            body,
          }
        },
      }),
      github: builder.query<any, void>({
        query: () => `v1/auth/github`,
      }),
      githubCallback: builder.query<any, void>({
        query: () => `v1/auth/github/callback`,
      }),
    }
  },
})

export const {
  useGoogleQuery,
  useGoogleCallbackQuery,
  useGithubQuery,
  useLoginMutation,
  useRegistrationMutation,
  useLogoutMutation,
} = authApi
