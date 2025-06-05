import { Header } from '@/components/header'
import { Sidebars } from '@/components/sidebar'
import { NextPage } from 'next'
import { PropsWithChildren } from 'react'
import s from './layout.module.scss'
import { useAppSelector } from '@/store'
import { fetchIsAuth } from '@/api/auth/auth.selectors'

const Layout: NextPage<PropsWithChildren> = ({ children }) => {
  const isAuth = useAppSelector(fetchIsAuth)

  return (
    <>
      <Header isAuth={isAuth} />
      <div className={s.content}>
        {isAuth && <Sidebars />}
        {children}
      </div>
    </>
  )
}

export default Layout
