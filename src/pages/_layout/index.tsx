import { Header } from '@/components/header'
import { Sidebars } from '@/components/sidebar'
import { NextPage } from 'next'
import { PropsWithChildren } from 'react'
import s from './navigationLayout.module.scss'

type navigationLayoutProps = {
  isAuth: boolean
}

const NavigationLayout: NextPage<PropsWithChildren & navigationLayoutProps> = props => {
  const { children, isAuth } = props
  return (
    <>
      <Header isAuth={isAuth} />
      <div className={s.authContent}>
        {isAuth ? <Sidebars /> : ''}
        {children}
      </div>
    </>
  )
}

export default NavigationLayout
