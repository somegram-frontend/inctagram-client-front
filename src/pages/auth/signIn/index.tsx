import { FormSignIn } from '@/pages/ui/auth/signIn/formSignIn/FormSignIn'
import { useRouter } from 'next/router'
import { useLoginMutation } from '@/api/auth-api'
import { EnumTokens } from '@/api/auth-api.types'

const SignIn = () => {
  const router = useRouter()
  const [signIn, { isError, data, isSuccess, isLoading }] = useLoginMutation()

  if (isLoading) return <h2>...Loading</h2> // TODO use Preloader

  if (isSuccess && data.accessToken) {
    localStorage.setItem(EnumTokens.ACCESS_TOKEN, data.accessToken)
    void router.push(`/`)
  }

  return (
    <>
      <FormSignIn
        errorMessage={isError ? 'The email or password are incorrect. Try again please' : ''}
        onSubmit={signIn}
      />
    </>
  )
}

export default SignIn