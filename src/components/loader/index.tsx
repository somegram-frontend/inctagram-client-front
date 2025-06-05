import s from './loader.module.scss'
import clsx from 'clsx'

type Props = {
  fullHeight?: boolean
  className?: string
}

export const Loader = ({ fullHeight, className }: Props) => {
  return (
    <div className={clsx(s.spinnerContainer, fullHeight && s.fullHeight, className)}>
      <div className={s.loader}></div>
    </div>
  )
}
