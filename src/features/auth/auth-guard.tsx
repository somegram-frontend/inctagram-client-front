import { useAppSelector } from '@/store'
import { fetchIsAuth, fetchIsLoading, fetchIsLogoutLoading } from '@/api/auth/auth.selectors'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Loader } from '@/components/loader'

const isPublicRoute = (pathname: string): boolean => {
  const publicRoutes = [
    { path: '/', exact: true },
    { path: '/auth', exact: false },
    { path: '/privacy-policy', exact: false },
    { path: '/public-user', exact: true },
    { path: '/public-user/profile', exact: false },
  ]

  return publicRoutes.some(route => {
    if (route.exact) {
      return pathname === route.path
    } else {
      return pathname.startsWith(route.path)
    }
  })
}

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const isAuth = useAppSelector(fetchIsAuth)
  const isLoading = useAppSelector(fetchIsLoading)
  const isLogoutLoading = useAppSelector(fetchIsLogoutLoading)
  const router = useRouter()

  useEffect(() => {
    if (isLoading || isLogoutLoading) return

    const currentPath = router.pathname
    const isPublic = isPublicRoute(currentPath)

    console.log('AuthGuard debug:', {
      isAuth,
      currentPath,
      isPublic,
      isLoading,
      isLogoutLoading,
    })

    if (!isAuth && !isPublic) {
      console.log('Redirecting to home page from:', currentPath)
      router.push('/')
    }
  }, [isAuth, isLoading, isLogoutLoading, router.pathname])

  if (isLoading || isLogoutLoading) {
    return <Loader fullHeight />
  }

  return <>{children}</>
}
