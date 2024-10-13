import { FormSignIn } from '@/pages/auth/signIn/formSignIn/FormSignIn'
import { useRouter } from 'next/router'
import { useLoginMutation } from '@/api/auth-api'
import { EnumTokens } from '@/shared/const/enums'
import { Header } from '@/components/header'
import { useAuthRedirect } from '@/pages/auth/authProviders/useAuthRedirect'
import { Loader } from '@/components/loader/Loader'
import { RegistrationResponse } from '@/api/auth-api.types'
import { toast } from 'react-toastify'

const SignIn = () => {
  const { onSignGit, onSignGoogle } = useAuthRedirect()
  const router = useRouter()

  const [signIn, { isError, data, isSuccess, isLoading, error }] = useLoginMutation()
  if (isLoading) return <Loader />

  if (isSuccess && data.accessToken) {
    localStorage.setItem(EnumTokens.ACCESS_TOKEN, data.accessToken)
    toast.success('You are login successfully.')
    router.push(`/user`)
  }

  if (isError) {
    const err = error as { data: RegistrationResponse }
    if (err.data?.details) {
      const errorMessage = `${err.data.details.email! || ''} ${err.data.details.username || ''}`
      toast.error(errorMessage)
    } else if (err.data?.errors) {
      const errorMessages = err.data.errors
        .map(e => Object.values(e.constraints).join(', '))
        .join('; ')
      toast.error(errorMessages)
    } else {
      toast.error(err.data?.message || 'Registration failed')
    }
  }

  return (
    <>
      <Header isAuth={true} />
      <FormSignIn
        errorMessage={isError ? 'The email or password are incorrect. Try again please' : ''}
        onSubmit={signIn}
        onSignGit={onSignGit}
        onSignGoogle={onSignGoogle}
      />
    </>
  )
}

export default SignIn
