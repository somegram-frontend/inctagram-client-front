import { useEffect } from 'react'
import { useMeQuery } from '@/api/auth/auth-api'
import { authActions } from '@/api/auth/auth.slice'
import { useAppDispatch, useAppSelector } from '@/store'
import { MeErrorResponse } from '@/api/auth/auth-api.types'
import { fetchIsAuth } from '@/api/auth/auth.selectors'

export const AppInitializer = () => {
  const dispatch = useAppDispatch()
  const { data, error, isFetching } = useMeQuery()
  const isAuth = useAppSelector(fetchIsAuth)

  useEffect(() => {
    if (!isFetching) {
      if (data) {
        dispatch(authActions.setAuth(true))
      } else if (error && (error as MeErrorResponse)?.status !== 401) {
        dispatch(authActions.setAuth(false))
      }
      dispatch(authActions.setIsLoading(false))
    }
  }, [data, error, isFetching, dispatch, isAuth])

  return null
}
