import { useRouter } from 'next/router'
import { FormSignUp, SignUpForm } from './ui/FormSignUp'

const SignUp = () => {
  const router = useRouter()
  const onSubmitSignUp = (formData: SignUpForm) => {
    const email = formData.email

    router.push(`/ui/auth/signUp/email-sent?email=${encodeURIComponent(email)}`)
  }

  return <FormSignUp onSubmit={onSubmitSignUp} />
}

export default SignUp
