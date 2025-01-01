import React from 'react'
import { PaypalSvgrepoCom4, StripeSvgrepoCom4, Typography } from '@honor-ui/inctagram-ui-kit'
import s from './paymentsPayPalOrStripe.module.scss'

export const PaymentsPayPalOrStripe = () => {
  return (
    <div className={s.wrapper}>
      <button style={{ cursor: 'pointer' }}>
        <PaypalSvgrepoCom4 width={96} height={64} viewBox={'0,0,24,16'} />
      </button>
      <Typography variant={'h2'}>Or</Typography>
      <button style={{ cursor: 'pointer' }}>
        <StripeSvgrepoCom4 width={96} height={64} viewBox={'0,0,24,16'} />
      </button>
    </div>
  )
}
