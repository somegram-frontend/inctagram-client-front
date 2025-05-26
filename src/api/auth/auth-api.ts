import { baseApi } from '@/api/_base/base-api'
import {
  ConfirmationResponse,
  LoginArgs,
  LoginResponse,
  MeResponse,
  RegistrationArgs,
  RegistrationConformationArgs,
  RegistrationReconfirmationArgs,
  RegistrationResponse,
  restorePasswordArgs,
  RestorePasswordConfirmationArgs,
} from '@/api/auth/auth-api.types'
import Router from 'next/router'
import { EnumTokens } from '@/shared/const/enums'
import { authActions } from '@/api/auth/auth.slice'

export const authApi = baseApi.injectEndpoints({
  endpoints: builder => {
    return {
      registration: builder.mutation<RegistrationResponse, RegistrationArgs>({
        query: body => {
          return {
            url: 'v1/auth/registration',
            method: 'POST',
            body,
          }
        },
      }),
      conformation: builder.mutation<ConfirmationResponse, RegistrationConformationArgs>({
        query: body => {
          return {
            url: 'v1/auth/registration-confirmation',
            method: 'POST',
            body,
          }
        },
      }),
      reconformation: builder.mutation<RegistrationResponse, RegistrationReconfirmationArgs>({
        query: body => {
          return {
            url: 'v1/auth/registration-email-resending',
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
      restorePasswordConfirmation: builder.mutation<any, RestorePasswordConfirmationArgs>({
        query: body => {
          return {
            url: 'v1/auth/restore-password-confirmation',
            method: 'POST',
            body,
          }
        },
      }),
      login: builder.mutation<LoginResponse, LoginArgs>({
        query: body => {
          return {
            url: 'v1/auth/login',
            method: 'POST',
            body,
            credentials: 'include',
          }
        },
        invalidatesTags: ['Me'],
      }),
      logout: builder.mutation<void, void>({
        query: () => {
          return {
            url: 'v1/auth/logout',
            method: 'POST',
            credentials: 'include',
          }
        },
        async onQueryStarted(_, { dispatch, queryFulfilled, getState }) {
          dispatch(authActions.setIsLogoutLoading(true))

          try {
            await queryFulfilled
            await Router.push('/auth/signIn')

            localStorage.removeItem(EnumTokens.ACCESS_TOKEN)
            dispatch(authApi.util.invalidateTags(['Me']))
            dispatch(authApi.util.resetApiState())
            dispatch(authActions.setAuth(false))
          } catch {
          } finally {
            dispatch(authActions.setIsLogoutLoading(false))
          }
        },
      }),
      refreshToken: builder.mutation<void, void>({
        query: () => {
          return {
            url: 'v1/auth/refresh-token',
            method: 'POST',
          }
        },
      }),
      github: builder.query<any, void>({
        query: () => `v1/auth/github`,
      }),
      githubCallback: builder.query<any, void>({
        query: () => `v1/auth/github/callback`,
      }),
      me: builder.query<MeResponse, void>({
        query: () => '/v1/auth/me',
        providesTags: ['Me', 'Profile'],
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
  useConformationMutation,
  useReconformationMutation,
  useLogoutMutation,
  useMeQuery,
  useRecaptchaSiteKeyQuery,
  useRestorePasswordMutation,
  useRestorePasswordConfirmationMutation,
} = authApi
