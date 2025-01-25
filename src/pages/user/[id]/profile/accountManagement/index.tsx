import React, {useState} from 'react'
import AccountTypeCheckBox from './accountTypeCheckBox'
import AccountSubsCosts from './accountSubsCosts'
import {Cards, Checkbox, Typography} from '@honor-ui/inctagram-ui-kit'
import s from './AccountManagement.module.scss'
import {
  useDisableAutoRenewalMutation,
  useEnableAutoRenewalMutation,
  useGetPaymentsInfoQuery,
} from '@/api/payments/payments-api'
import {safeFormatDate} from '@/shared/utils/formatDate'
import {Loader} from '@/components/loader'
import {useDelayedRefetch} from '@/shared/hooks/useDelayedRefetch'
import {tryCatch} from '@/shared/utils/tryCatch'

const SUBSCRIPTION = ['Expire at', 'Next payment'] as const

export type AccountType = 'Personal' | 'Business'

const AccountManagement = () => {
  const [enableAutoRenewal, { isLoading: isEnabling }] = useEnableAutoRenewalMutation()
  const [disableAutoRenewal, { isLoading: isDisabling }] = useDisableAutoRenewalMutation()
  const {
    data: paymentsInfo,
    isLoading: isPaymentsInfoLoading,
    refetch,
  } = useGetPaymentsInfoQuery()
  const { delayedRefetch, isLoading: isRefetching } = useDelayedRefetch(refetch, 3000)

  const [accountType, setAccountType] = useState<AccountType>('Personal')

  const toggleAutoRenewal = async () => {
    return tryCatch(async () => {
      // Если paymentsInfo не пришёл, не делаем лишних вызовов
      if (!paymentsInfo) return

      await (paymentsInfo?.autoRenewal ? disableAutoRenewal() : enableAutoRenewal()).unwrap()
      delayedRefetch()
    })
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAccountType(event.target.value as AccountType)
  }

  const isLoading = isPaymentsInfoLoading || isEnabling || isDisabling || isRefetching
  const isDisabled = isLoading || paymentsInfo?.status !== 'Active'

  if (isPaymentsInfoLoading) {
    return <Loader />
  }

  return (
    <>
      <Cards className={s.block}>
        {SUBSCRIPTION.map(current => (
          <Typography className={s.blockItem} key={current} variant={'regular_text14'}>
            <span>{current}</span>
            {current === 'Expire at' && safeFormatDate(paymentsInfo?.dateOfPayment)}
            {current === 'Next payment' && safeFormatDate(paymentsInfo?.endDateOfSubscription)}
          </Typography>
        ))}
      </Cards>

      {
        <Checkbox
          label={isRefetching ? 'Updating...' : 'Auto-Renewal'}
          checked={paymentsInfo?.autoRenewal ?? false}
          onCheckedChange={toggleAutoRenewal}
          disabled={isDisabled}
        />
      }

      <AccountTypeCheckBox accountType={accountType} handleChange={handleChange} />
      {accountType === 'Business' && <AccountSubsCosts />}
    </>
  )
}

export default AccountManagement
