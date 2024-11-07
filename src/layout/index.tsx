import { Header } from '@/components/header'
import { Sidebars } from '@/components/sidebar'
import { NextPage } from 'next'
import { PropsWithChildren } from 'react'
import s from './layout.module.scss'

type layoutProps = {
  isAuth: boolean
}

const Layout: NextPage<PropsWithChildren & layoutProps> = props => {
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

export default Layout
