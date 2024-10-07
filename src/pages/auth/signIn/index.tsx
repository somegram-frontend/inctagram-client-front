import { FormSignIn } from '@/pages/auth/signIn/formSignIn/FormSignIn'
import { useRouter } from 'next/router'
import { useLoginMutation } from '@/api/auth-api'
import { EnumTokens } from '@/shared/const/enums'
import { Header } from '@/components/header'
import { useAuthRedirect } from '@/pages/auth/authProviders/useAuthRedirect'

const SignIn = () => {
  const { onSignGit, onSignGoogle } = useAuthRedirect()
  const router = useRouter()

  const [signIn, { isError, data, isSuccess, isLoading }] = useLoginMutation()
  if (isLoading) return <h2>...Loading</h2> // TODO use Preloader

  if (isSuccess && data.accessToken) {
    localStorage.setItem(EnumTokens.ACCESS_TOKEN, data.accessToken)
    void router.push(`/users/profile`)
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
