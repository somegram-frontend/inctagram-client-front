import { useRouter } from 'next/router'
import { FormSignUp, SignUpForm } from './ui/FormSignUp'

const SignUp = () => {
  const router = useRouter()
  const onSubmitSignUp = (formData: SignUpForm) => {
    router.push('/email-sent')
  }

  return <FormSignUp onSubmit={onSubmitSignUp} />
}

export default SignUp
