import React from 'react'
import {PaypalSvgrepoCom4, StripeSvgrepoCom4, Typography} from '@honor-ui/inctagram-ui-kit'
import s from './paymentsPayPalOrStripe.module.scss'
import {useCreatePaymentMutation} from '@/api/payments/payments-api'
import {toast} from 'react-toastify'
import {useTranslation} from "@/shared/hooks";

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

const PaymentsPayPalOrStripe = ({subCosts}: Props) => {
  const [createPayment, {isLoading, error}] = useCreatePaymentMutation()
  const t = useTranslation('accountManagement')
  const getSubscriptionType = (cost: string): SubscriptionType => {
    if (cost === t.day) return 'DAY'
    if (cost === t.week) return 'WEEKLY'
    if (cost === t.month) return 'MONTHLY'
    throw new Error('Invalid subscription cost')
  }

  const handlePayment = async (paymentSystem: 'PAYPAL' | 'STRIPE') => {
    try {
      const subscriptionType = getSubscriptionType(subCosts)
      const response = await createPayment({subscriptionType, paymentSystem}).unwrap()
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
      <button style={{cursor: isLoading ? 'not-allowed' : 'pointer'}} disabled={isLoading}>
        <PaypalSvgrepoCom4
          width={96}
          height={64}
          viewBox={'0,0,24,16'}
          onClick={() => handlePayment('PAYPAL')}
        />
      </button>
      <Typography variant={'h2'}>{t.or}</Typography>
      <button style={{cursor: isLoading ? 'not-allowed' : 'pointer'}} disabled={isLoading}>
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
