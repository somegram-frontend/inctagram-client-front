import React, {useState} from 'react'
import s from './accountSubsCosts.module.scss'
import {Button, Typography} from '@honor-ui/inctagram-ui-kit'
import {useDeleteSubMutation} from '@/api/payments/payments-api'
import CheckBoxTitle from './checkBoxTitle/checkBoxTitle'
import PaymentsPayPalOrStripe from '../paymentsPayPalOrStripe'
import {useTranslation} from "@/shared/hooks";

export type AccountSubsType = '$10 per 1 Day' | '$50 per 7 Day' | '$100 per month'

const AccountSubsCosts = () => {
  const t = useTranslation('accountManagement')
  const [subCosts, setSubsCosts] = useState<AccountSubsType>(t.day as AccountSubsType)
  const [deleteSub] = useDeleteSubMutation()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSubsCosts(event.target.value as AccountSubsType)
  }

  const subs = [
    {id: 1, handle: handleChange, subValue: t.day},
    {id: 2, handle: handleChange, subValue: t.week},
    {id: 3, handle: handleChange, subValue: t.month},
  ]

  return (
    <div className={s.accountType}>
      <Button onClick={() => deleteSub()}>{t.deleteSubscription}</Button>
      <Typography variant={'h2'}>{t.subscriptionCosts}:</Typography>
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
      <PaymentsPayPalOrStripe subCosts={subCosts}/>
    </div>
  )
}

export default AccountSubsCosts
