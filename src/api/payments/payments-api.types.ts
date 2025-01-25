export type PaymentResponse = {
  url: string
}

export type PaymentRequest = {
  subscriptionType: 'MONTHLY' | 'DAY' | 'WEEKLY'
  paymentSystem: 'STRIPE' | 'PAYPAL'
}

export type Payment = {
  subscriptionType: string
  price: number
  paymentSystem: string
  status: string
  dateOfPayment: string
  endDateOfSubscription: string
  subscriptionId: string
}

export type MyPaymentsResponse = {
  pageSize: number
  totalCount: number
  items: Array<Payment>
  pagesCount: number
}

export type MyPaymentsSearchParams = {
  pageSize: number
  pageNumber: number
}

export type PaymentsInfoResponse = {
  status: string
  dateOfPayment: string
  endDateOfSubscription: string
  subscriptionId: string
  userId: string
  subscriptionType: string
  autoRenewal: boolean
}
