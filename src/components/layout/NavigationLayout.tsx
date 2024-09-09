import { Header } from '@/components/header'
import { Sidebars } from '@/components/sidebar'
import { NextPage } from 'next'
import { PropsWithChildren } from 'react'

type navigationLayoutProps = {
  isAuth: boolean
}

const NavigationLayout: NextPage<PropsWithChildren & navigationLayoutProps> = props => {
  const { children, isAuth } = props
  return (
    <>
      <Header isAuth={isAuth} />
      {isAuth ? <Sidebars /> : ''}
      {children}
    </>
  )
}

export default NavigationLayout
