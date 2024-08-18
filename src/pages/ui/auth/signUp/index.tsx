import { useRouter } from 'next/router'
import { FormSignUp, SignUpForm } from './ui/formSingUp/FormSignUp'
import { useRegistrationMutation } from '@/api/auth-api'
import { emailTemplateConfirmEmail } from './emailTemplateConfirmEmail'
import { registrationArgs, registrationErrorResponse422 } from '@/api/auth-api.types'
import { toast } from 'react-toastify'

const SignUp = () => {
  const router = useRouter()
  const [signUp, signUpResult] = useRegistrationMutation()
  let email: string = ''
  const onSubmitSignUp = (formData: SignUpForm) => {
    email = formData.email
    const signUpData: registrationArgs = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      html: emailTemplateConfirmEmail,
    }
    signUp(signUpData)
  }
  // TODO
  if (signUpResult.isLoading) return <h2>...Loading</h2> // TODO use Preloader

  if (signUpResult.error) {
    const error = signUpResult.error as registrationErrorResponse422
    const Error = `${error?.errors && error?.errors[0].constraints.IsUsername}
    ${error?.errors && error?.errors[1].constraints.isEmail}
    ${error?.errors && error?.errors[2].constraints.length}`

    toast.error(Error ?? 'Registration failed')
  }

  if (signUpResult.isSuccess) {
    toast.success('Registration completed successfully.\nCheck your email')
    router.push(`/ui/auth/signUp/ui/emailSent?email=${encodeURIComponent(email)}`)
  }

  return <FormSignUp onSubmit={onSubmitSignUp} />
}

export default SignUp
