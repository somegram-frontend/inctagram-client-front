import '@/assets/styles/globals.css'
import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { Inter } from 'next/font/google'
import { wrapper } from '@/store'
import { Provider } from 'react-redux'
import 'react-toastify/dist/ReactToastify.css'
import { Slide, ToastContainer } from 'react-toastify'
import '@honor-ui/inctagram-ui-kit/css'
import { AppInitializer } from '@/features/auth/app-initializer'
import { AuthGuard } from '@/features/auth/auth-guard'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const inter = Inter({ subsets: ['latin'] })

export default function MyApp({ Component, ...rest }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? (page => page)

  const { store, props } = wrapper.useWrappedStore(rest)

  return (
    <Provider store={store}>
      <AppInitializer />
      <AuthGuard>
        <main className={inter.className}>
          {getLayout(<Component {...props.pageProps} />)}
          <ToastContainer
            autoClose={3000}
            closeOnClick
            draggable
            hideProgressBar={false}
            pauseOnFocusLoss
            pauseOnHover
            position={'bottom-left'}
            rtl={false}
            stacked
            style={{ marginLeft: '10px' }}
            theme={'dark'}
            transition={Slide}
          />
        </main>
      </AuthGuard>
    </Provider>
  )
}
