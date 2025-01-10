import { Payment } from '@/api/payments/payments-api.types'
import s from './payments.module.scss'

type PaymentDateProps = {
  timestamp: string
}

const PaymentDate = (props: PaymentDateProps) => {
  const { timestamp } = props
  const paymentDate = new Date(timestamp).toLocaleDateString('ru-Ru')
  const [day, month, year] = paymentDate.split('.')
  return <time dateTime={`${year}-${month}-${day}`}>{paymentDate}</time>
}

type Props = {
  items: Array<Payment>
}

const THead = () => {
  return (
    <thead className={s.table__thead}>
      <tr>
        <th className={s.table__th} scope="col">
          Date of Payment
        </th>
        <th className={s.table__th} scope="col">
          End date of subscription
        </th>
        <th className={s.table__th_leftAligned} scope="col">
          Price
        </th>
        <th className={s.table__th_subscrType} scope="col">
          Subscription Type
        </th>
        <th className={s.table__th} scope="col">
          Payment Type
        </th>
      </tr>
    </thead>
  )
}

const TBody = (props: Props) => {
  const { items } = props
  return (
    <tbody>
      {items.map(attr => {
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
              <PaymentDate timestamp={dateOfPayment} />
            </td>
            <td className={s.table__td}>
              <PaymentDate timestamp={endDateOfSubscription} />
            </td>
            <td className={s.table__td + ' ' + s.table__td_leftAligned}>${price}</td>
            {/* в тестовом api пока нету этого поля, забыли добавить */}
            {/* <td>{subscriptionType.toLowerCase()}</td> */}
            <td className={s.table__td + ' ' + s.table__td_subscrType}>{'DAILY'}</td>
            <td className={s.table__td}>{paymentSystem}</td>
          </tr>
        )
      })}
    </tbody>
  )
}

export const PaymentsTable = (props: Props) => {
  const { items } = props

  return (
    <table className={s.table}>
      <THead />
      <TBody items={items} />
    </table>
  )
}
