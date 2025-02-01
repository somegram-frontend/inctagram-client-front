import {Payment} from '@/api/payments/payments-api.types'
import s from './payments.module.scss'
import {useTranslation} from "@/shared/hooks";

type PaymentDateProps = {
  timestamp: string
}

const PaymentDate = (props: PaymentDateProps) => {
  const {timestamp} = props
  const paymentDate = new Date(timestamp).toLocaleDateString('ru-Ru')
  const [day, month, year] = paymentDate.split('.')
  return <time dateTime={`${year}-${month}-${day}`}>{paymentDate}</time>
}

type Props = {
  items: Array<Payment>
}

const THead = () => {
  const t = useTranslation('myPayments')

  return (
    <thead className={s.table__thead}>
    <tr>
      <th className={s.table__th} scope="col">
        {t.dateOfPayment}
      </th>
      <th className={s.table__th} scope="col">
        {t.endDateOfSubscription}
      </th>
      <th className={s.table__th_leftAligned} scope="col">
        {t.price}
      </th>
      <th className={s.table__th_subscrType} scope="col">
        {t.subscriptionType}
      </th>
      <th className={s.table__th} scope="col">
        {t.paymentType}
      </th>
    </tr>
    </thead>
  )
}

const TBody = (props: Props) => {
  const t = useTranslation('myPayments')

  const {items} = props
  return (
    <tbody>
    {items?.map(attr => {
      const {
        subscriptionType,
        price,
        paymentSystem,
        dateOfPayment,
        endDateOfSubscription,
        subscriptionId,
      } = attr
      return (
        <tr key={subscriptionId} className={s.table__bodyRow}>
          <td className={s.table__td}>
            <PaymentDate timestamp={dateOfPayment}/>
          </td>
          <td className={s.table__td}>
            <PaymentDate timestamp={endDateOfSubscription}/>
          </td>
          <td className={s.table__td + ' ' + s.table__td_leftAligned}>${price}</td>
          <td className={s.table__td + ' ' + s.table__td_subscrType}>
            {t[subscriptionType.toLowerCase() as keyof typeof t]}
          </td>
          <td className={s.table__td}>{paymentSystem}</td>
        </tr>
      )
    })}
    </tbody>
  )
}

const PaymentsTable = (props: Props) => {
  const {items} = props

  return (
    <table className={s.table}>
      <THead/>
      <TBody items={items}/>
    </table>
  )
}

export default PaymentsTable
