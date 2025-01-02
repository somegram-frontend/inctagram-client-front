export type PaymentResponse = {
  url: string
}

export type PaymentRequest = {
  subscriptionType: 'MONTHLY' | 'DAY' | 'WEEKLY'
  paymentSystem: 'STRIPE' | 'PAYPAL'
}
