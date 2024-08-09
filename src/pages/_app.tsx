import '@/styles/globals.css'
import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { Inter } from 'next/font/google'
import { wrapper } from '@/store'
import { Provider } from 'react-redux'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const inter = Inter({ subsets: ['latin'] })

export default function MyApp({ Component, ...rest }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? (page => page)

  const { store, props } = wrapper.useWrappedStore(rest)

  return getLayout(
    <Provider store={store}>
      <main className={inter.className}>
        <Component {...props.pageProps} />
      </main>
    </Provider>
  )
}
