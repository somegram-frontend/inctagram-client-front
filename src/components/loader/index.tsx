import s from './loader.module.scss'

export const Loader = () => {
  return (
    <div className={s.spinnerContainer}>
      <div className={s.loader}></div>
    </div>
  )
}
