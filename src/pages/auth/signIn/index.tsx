import { FormSignIn } from '@/pages/auth/signIn/formSignIn'
import { useRouter } from 'next/router'
import { useLoginMutation } from '@/api/auth/auth-api'
import { EnumTokens } from '@/shared/const/enums'
import { useAuthRedirect } from '@/pages/auth/authProviders/useAuthRedirect'
import { Loader } from '@/components/loader'
import { RegistrationResponse } from '@/api/auth/auth-api.types'
import { toast } from 'react-toastify'
import Layout from '@/layout'

const SignIn = () => {
  const { onSignGit, onSignGoogle } = useAuthRedirect()
  const router = useRouter()

  const [signIn, { isError, data, isSuccess, isLoading, error }] = useLoginMutation()
  if (isLoading) return <Loader />

  if (isSuccess && data.accessToken) {
    localStorage.setItem(EnumTokens.ACCESS_TOKEN, data.accessToken)
    toast.success('You are login successfully.')
    router.push(`/`)
  }

  if (isError) {
    const err = error as { data: RegistrationResponse }
    if (err.data?.details) {
      const errorMessage = `${err.data.details.email! || ''} ${err.data.details.username || ''}`
      toast.error(errorMessage, { toastId: 'error-message-id-1' })
    } else if (err.data?.errors) {
      const errorMessages = err.data.errors
        .map(e => Object.values(e.constraints).join(', '))
        .join('; ')
      toast.error(errorMessages, { toastId: 'error-message-id-2' })
    } else {
      toast.error(err.data?.message || 'Registration failed', { toastId: 'error-message-id-3' })
    }
  }

  return (
    <Layout>
      <FormSignIn
        errorMessage={isError ? 'The email or password are incorrect. Try again please' : ''}
        onSubmit={signIn}
        onSignGit={onSignGit}
        onSignGoogle={onSignGoogle}
      />
    </Layout>
  )
}

export default SignIn
