import { Header } from '@/components/header'
import { Sidebars } from '@/components/sidebar'
import { NextPage } from 'next'
import { PropsWithChildren, useEffect } from 'react'
import s from './layout.module.scss'
import { useMeQuery } from '@/api/auth/auth-api'
import { MeErrorResponse } from '@/api/auth/auth-api.types'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'

const Layout: NextPage<PropsWithChildren> = ({ children }) => {
  const router = useRouter()
  const { data, error } = useMeQuery()

  const isAuth = !((error as MeErrorResponse)?.status === 401)

  useEffect(() => {
    if (error && (error as MeErrorResponse)?.status !== 401) {
      toast.error((error as MeErrorResponse)?.data.message)

      if (typeof window !== 'undefined') {
        router.push('/')
      }
    }
  }, [error, router])

  return (
    <>
      <Header isAuth={isAuth} />
      <div className={s.content}>
        {isAuth && <Sidebars isAuth={isAuth} data={data} />}
        {children}
      </div>
    </>
  )
}

export default Layout
