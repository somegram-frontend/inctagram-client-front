import React from 'react'
import { OutlineBell } from '@honor-ui/inctagram-ui-kit'
import s from './BellNotifications.module.scss'

type Props<T> = {
  notifications: T[]
  filterFn: (n: T) => boolean
}
export const BellNotifications = <T,>({ notifications, filterFn }: Props<T>) => {
  const count = notifications.filter(filterFn).length

  return (
    <div className={s.containerBell}>
      <OutlineBell className={s.bell} />
      {count > 0 && <div className={s.notifications}>{count}</div>}
    </div>
  )
}
