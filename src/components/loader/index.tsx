import s from './loader.module.scss'
import clsx from "clsx";

type Props = {
  fullHeight?: boolean
}

export const Loader = ({fullHeight}: Props) => {
  return (
    <div className={clsx(s.spinnerContainer,fullHeight && s.fullHeight)}>
      <div className={s.loader}></div>
    </div>
  )
}
