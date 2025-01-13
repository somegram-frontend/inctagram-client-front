import React, { useState } from 'react'
import s from './accountSubsCosts.module.scss'
import { Button, Typography } from '@honor-ui/inctagram-ui-kit'
import { PaymentsPayPalOrStripe } from '@/pages/user/[id]/profile/accountManagement/paymentsPayPalOrStripe'
import { useDeleteSubMutation } from '@/api/payments/payments-api'
import { CheckBoxTitle } from '@/pages/user/[id]/profile/accountManagement/accountSubsCosts/checkBoxTitle/checkBoxTitle'

export type AccountSubsType = '$10 per 1 Day' | '$50 per 7 Day' | '$100 per month'

export const AccountSubsCosts = () => {
  const [subCosts, setSubsCosts] = useState<AccountSubsType>('$10 per 1 Day')
  const [deleteSub] = useDeleteSubMutation()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSubsCosts(event.target.value as AccountSubsType)
  }

  const subs = [
    { id: 1, handle: handleChange, subValue: '$10 per 1 Day' },
    { id: 2, handle: handleChange, subValue: '$50 per 7 Day' },
    { id: 3, handle: handleChange, subValue: '$100 per month' },
  ]

  return (
    <div className={s.accountType}>
      <Button onClick={() => deleteSub()}>Delete Subscription</Button>
      <Typography variant={'h2'}>Your subscription costs:</Typography>
      <div className={s.wrapper}>
        {subs.map(s => (
          <CheckBoxTitle
            key={s.id}
            handleChange={s.handle}
            subValue={s.subValue}
            isChecked={subCosts === s.subValue}
          />
        ))}
      </div>
      <PaymentsPayPalOrStripe subCosts={subCosts} />
    </div>
  )
}
