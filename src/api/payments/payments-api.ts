import { baseApi } from '@/api/_base/base-api'
import {
  MyPaymentsResponse,
  MyPaymentsSearchParams,
  PaymentRequest,
  PaymentResponse,
  PaymentsInfoResponse,
} from './payments-api.types'

export const paymentsApi = baseApi.injectEndpoints({
  endpoints: builder => {
    return {
      createPayment: builder.mutation<PaymentResponse, PaymentRequest>({
        query: data => {
          return {
            url: `/v1/subscriptions/create-payment`,
            method: 'POST',
            body: data,
          }
        },
      }),
      deleteSub: builder.mutation<void, void>({
        query: () => {
          return {
            url: `/v1/subscriptions/testing/cancel-subscription`,
            method: 'DELETE',
          }
        },
      }),
      getMyPayments: builder.query<MyPaymentsResponse, MyPaymentsSearchParams>({
        query: params => {
          return {
            url: '/v1/subscriptions/my-payments',
            params,
          }
        },
      }),
      enableAutoRenewal: builder.mutation<void, void>({
        query: () => {
          return {
            url: '/v1/subscriptions/enable-auto-renewal',
            method: 'POST',
          }
        },
      }),
      disableAutoRenewal: builder.mutation<void, void>({
        query: () => {
          return {
            url: '/v1/subscriptions/disable-auto-renewal',
            method: 'POST',
          }
        },
      }),
      getPaymentsInfo: builder.query<PaymentsInfoResponse, void>({
        query: () => ({ url: '/v1/subscriptions/info' }),
      }),
    }
  },
})

export const {
  useCreatePaymentMutation,
  useDeleteSubMutation,
  useGetMyPaymentsQuery,
  useEnableAutoRenewalMutation,
  useDisableAutoRenewalMutation,
  useGetPaymentsInfoQuery,
} = paymentsApi
