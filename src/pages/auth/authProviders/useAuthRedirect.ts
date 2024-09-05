import { useCallback } from 'react'

export const useAuthRedirect = () => {
  const onSignGit = useCallback(() => {
    window.location.assign('https://somegram.online/api/v1/auth/github')
  }, [])

  const onSignGoogle = useCallback(() => {
    window.location.assign('https://somegram.online/api/v1/auth/google')
  }, [])

  return { onSignGit, onSignGoogle }
}
