import React from 'react';
import s from './PaymentsAutoRenewal.module.scss'
import {Cards, Checkbox, Typography} from "@honor-ui/inctagram-ui-kit";
import {safeFormatDate} from "@/shared/utils/formatDate";
import {
  useDisableAutoRenewalMutation,
  useEnableAutoRenewalMutation,
  useGetPaymentsInfoQuery
} from "@/api/payments/payments-api";
import {useDelayedRefetch} from "@/shared/hooks/useDelayedRefetch";
import {tryCatch} from "@/shared/utils/tryCatch";
import {Loader} from "@/components/loader";
import {PaymentsInfoResponse} from "@/api/payments/payments-api.types";

type Subscription = {
  label: 'Expire at' | 'Next payment',
  key: keyof Pick<PaymentsInfoResponse, 'dateOfPayment' | 'endDateOfSubscription'>
}
const SUBSCRIPTION: Subscription[] = [
  {label: 'Expire at', key: 'dateOfPayment'},
  {label: 'Next payment', key: 'endDateOfSubscription'}
]

export const PaymentsAutoRenewal = () => {
  const [enableAutoRenewal, {isLoading: isEnabling}] = useEnableAutoRenewalMutation()
  const [disableAutoRenewal, {isLoading: isDisabling}] = useDisableAutoRenewalMutation()
  const {
    data: paymentsInfo,
    isLoading: isPaymentsInfoLoading,
    refetch,
  } = useGetPaymentsInfoQuery()
  const {delayedRefetch, isLoading: isRefetching} = useDelayedRefetch(refetch, 3000)

  const toggleAutoRenewal = async () => {
    return tryCatch(async () => {
      // Если paymentsInfo не пришёл, не делаем лишних вызовов
      if (!paymentsInfo) return

      await (paymentsInfo?.autoRenewal ? disableAutoRenewal() : enableAutoRenewal()).unwrap()
      delayedRefetch()
    })
  }

  const isLoading = isPaymentsInfoLoading || isEnabling || isDisabling || isRefetching
  const isDisabled = isLoading || paymentsInfo?.status !== 'Active'

  if (isPaymentsInfoLoading) {
    return <Loader/>
  }

  return (
    <>
      {paymentsInfo?.status === 'Active' &&

        <div className={s.paymentsAutoRenewal}>
          <Cards className={s.block}>
            {SUBSCRIPTION.map(({label, key}) => (
              <Typography className={s.blockItem} key={label} variant={'regular_text14'}>
                <span>{label}</span>
                {safeFormatDate(paymentsInfo?.[key])}
              </Typography>
            ))}
          </Cards>


          <Checkbox
            label={isRefetching ? 'Updating...' : 'Auto-Renewal'}
            checked={paymentsInfo?.autoRenewal ?? false}
            onCheckedChange={toggleAutoRenewal}
            disabled={isDisabled}
          />
        </div>
      }
    </>
  );
};
