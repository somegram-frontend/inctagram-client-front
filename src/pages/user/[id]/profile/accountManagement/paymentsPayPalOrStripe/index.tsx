import React from 'react'
import { PaypalSvgrepoCom4, StripeSvgrepoCom4, Typography } from '@honor-ui/inctagram-ui-kit'
import s from './paymentsPayPalOrStripe.module.scss'
import { useCreatePaymentMutation } from '@/api/payments/payments-api'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'

type SubscriptionType = 'MONTHLY' | 'DAY' | 'WEEKLY'

type ErrorResponse = {
  statusCode: number
  message: string
  errors: ErrorDetail[]
}

type ErrorDetail = {
  property: string
  constraints: {
    [key: string]: string
  }
}

type Props = {
  subCosts: string
}

const PaymentsPayPalOrStripe = ({ subCosts }: Props) => {
  const [createPayment, { isLoading, error }] = useCreatePaymentMutation()

  const getSubscriptionType = (cost: string): SubscriptionType => {
    if (cost === '$10 per 1 Day') return 'DAY'
    if (cost === '$50 per 7 Day') return 'WEEKLY'
    if (cost === '$100 per month') return 'MONTHLY'
    throw new Error('Invalid subscription cost')
  }

  const handlePayment = async (paymentSystem: 'PAYPAL' | 'STRIPE') => {
    try {
      const subscriptionType = getSubscriptionType(subCosts)
      const response = await createPayment({ subscriptionType, paymentSystem }).unwrap()
      console.log('Payment response:', response)
      if (response?.url) {
        window.location.href = response.url
      } else {
        console.error('URL for payment was not returned')
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error?.message)
      }
    }
  }

  return (
    <div className={s.wrapper}>
      <button style={{ cursor: isLoading ? 'not-allowed' : 'pointer' }} disabled={isLoading}>
        <PaypalSvgrepoCom4
          width={96}
          height={64}
          viewBox={'0,0,24,16'}
          onClick={() => handlePayment('PAYPAL')}
        />
      </button>
      <Typography variant={'h2'}>Or</Typography>
      <button style={{ cursor: isLoading ? 'not-allowed' : 'pointer' }} disabled={isLoading}>
        <StripeSvgrepoCom4
          width={96}
          height={64}
          viewBox={'0,0,24,16'}
          onClick={() => handlePayment('STRIPE')}
        />
      </button>
    </div>
  )
}

export default PaymentsPayPalOrStripe
