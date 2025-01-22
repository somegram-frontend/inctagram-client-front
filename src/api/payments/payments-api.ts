import { baseApi } from '@/api/_base/base-api'
import type {
  MyPaymentsResponse,
  MyPaymentsSearchParams,
  PaymentRequest,
  PaymentResponse,
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
        }
      }),
      getMyPayments: builder.query<MyPaymentsResponse, MyPaymentsSearchParams>({
        query: params => {
          return {
            url: '/v1/subscriptions/my-payments',
            params,
          }
        },
      }),
    }
  },
})

export const { useCreatePaymentMutation, useDeleteSubMutation } = paymentsApi
