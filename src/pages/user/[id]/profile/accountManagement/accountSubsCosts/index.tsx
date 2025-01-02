import React, { useState } from 'react'
import s from './accountSubsCosts.module.scss'
import { Typography } from '@honor-ui/inctagram-ui-kit'
import { PaymentsPayPalOrStripe } from '@/pages/user/[id]/profile/accountManagement/paymentsPayPalOrStripe'

export type AccountSubsType = '$10 per 1 Day' | '$50 per 7 Day' | '$100 per month'

export const AccountSubsCosts = () => {
  const [subCosts, setSubsCosts] = useState<AccountSubsType>('$10 per 1 Day')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSubsCosts(event.target.value as AccountSubsType)
  }

  return (
    <div className={s.accountType}>
      <Typography variant={'h2'}>Your subscription costs:</Typography>
      <div className={s.wrapper}>
        <div className={s.checkBoxTitle}>
          <input
            className={s.radioButton}
            type="radio"
            name="costs"
            value="$10 per 1 Day"
            checked={subCosts === '$10 per 1 Day'}
            onChange={handleChange}
          />
          <div>$10 per 1 Day</div>
        </div>

        <div className={s.checkBoxTitle}>
          <input
            className={s.radioButton}
            type="radio"
            name="costs"
            value="$50 per 7 Day"
            checked={subCosts === '$50 per 7 Day'}
            onChange={handleChange}
          />
          <div>$50 per 7 Day</div>
        </div>

        <div className={s.checkBoxTitle}>
          <input
            className={s.radioButton}
            type="radio"
            name="costs"
            value="$100 per month"
            checked={subCosts === '$100 per month'}
            onChange={handleChange}
          />
          <div>$100 per month</div>
        </div>
      </div>
      <PaymentsPayPalOrStripe subCosts={subCosts} />
    </div>
  )
}
