import { Header, Sidebars } from '@honor-ui/inctagram-ui-kit'
import { PropsWithChildren } from 'react'
import { NextPage } from 'next'

type navigationLayoutProps = {
  isAuth: boolean
}

const NavigationLayout: NextPage<PropsWithChildren & navigationLayoutProps> = props => {
  const { children, isAuth } = props
  return (
    <>
      <Header isAuth={isAuth} />
      {isAuth ? <Sidebars></Sidebars> : ''}
      {children}
    </>
  )
}

export default NavigationLayout
