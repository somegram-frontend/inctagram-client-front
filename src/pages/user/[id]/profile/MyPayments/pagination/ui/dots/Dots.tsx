import { forwardRef } from 'react'

import s from './dots.module.scss'

export const Dots = forwardRef<HTMLSpanElement>((_, ref) => {
  return (
    <span className={s.dots} ref={ref}>
      &#8230;
    </span>
  )
})

Dots.displayName = 'Dots'
