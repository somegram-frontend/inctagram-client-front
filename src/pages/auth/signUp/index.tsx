'use client'
import { useRouter } from 'next/router'
import { FormSignUp, SignUpForm } from './formSingUp/FormSignUp'
import { useRegistrationMutation } from '@/api/auth-api'
import { emailTemplateConfirmEmail } from './emailTemplateConfirmEmail'
import { RegistrationArgs, RegistrationResponse } from '@/api/auth-api.types'
import { toast } from 'react-toastify'

const SignUp = () => {
  const router = useRouter()
  const [signUp, { error, isError, isSuccess, isLoading, originalArgs }] = useRegistrationMutation()
  let email: string
  const onSubmitSignUp = (formData: SignUpForm) => {
    email = formData.email
    const signUpData: RegistrationArgs = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      html: emailTemplateConfirmEmail,
    }
    signUp(signUpData)
  }

  if (isLoading) return <h2>...Loading</h2> // TODO use Preloader

  if (isError) {
    const err = error as { data: RegistrationResponse }
    if ('details' in err.data) {
      const errorMessage =
        `${err.data.details.email || ''} ${err.data.details.username || ''}` ||
        'Registration failed'
      toast.error(errorMessage)
    } else if ('errors' in err.data) {
      const errorMessages = (err.data as RegistrationResponse).errors
        .map(e => Object.values(e.constraints).join(', '))
        .join('; ')
      toast.error(errorMessages)
    } else {
      toast.error('Registration failed')
    }
  }

  if (isSuccess) {
    toast.success('Registration completed successfully.\nCheck your email')
    const email = originalArgs?.email || ''
    router.push(`/auth/signUp/emailSent?email=${encodeURIComponent(email)}`)
  }

  return <FormSignUp onSubmit={onSubmitSignUp} />
}

export default SignUp
