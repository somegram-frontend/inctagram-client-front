import { useAppSelector } from '@/store'
import { fetchIsAuth, fetchIsLoading, fetchIsLogoutLoading } from '@/api/auth/auth.selectors'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Loader } from '@/components/loader'

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const isAuth = useAppSelector(fetchIsAuth)
  const isLoading = useAppSelector(fetchIsLoading)
  const isLogoutLoading = useAppSelector(fetchIsLogoutLoading)
  const router = useRouter()

  useEffect(() => {
    if (!isAuth && !isLoading) {
      const publicRoutes = ['/', '/auth/', '/public-user/']
      const isPublic = publicRoutes.some(route => router.pathname.startsWith(route))

      if (!isPublic && !isLogoutLoading) {
        router.push('/')
      }
    }
  }, [isAuth, isLoading, router, isLogoutLoading])

  if (isLogoutLoading || isLoading) return <Loader fullHeight />

  return <>{children}</>
}
