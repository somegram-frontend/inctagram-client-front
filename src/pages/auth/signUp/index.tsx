'use client'
import { useRouter } from 'next/router'
import { FormSignUp, SignUpForm } from './formSingUp'
import { useRegistrationMutation } from '@/api/auth-api'
import { emailTemplateConfirmEmail } from './emailTemplateConfirmEmail'
import { RegistrationArgs, RegistrationResponse } from '@/api/auth-api.types'
import { toast } from 'react-toastify'
import { Header } from '@/components/header'
import { useAuthRedirect } from '@/pages/auth/authProviders/useAuthRedirect'
import { Loader } from '@/components/loader'

const SignUp = () => {
  const { onSignGit, onSignGoogle } = useAuthRedirect()
  const router = useRouter()
  const [signUp, { error, isError, isSuccess, isLoading, originalArgs }] = useRegistrationMutation()
  const onSubmitSignUp = (formData: SignUpForm) => {
    const signUpData: RegistrationArgs = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      html: emailTemplateConfirmEmail,
    }
    signUp(signUpData)
  }

  if (isLoading) {
    return <Loader />
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

  if (isSuccess) {
    toast.success('Registration completed successfully.\nCheck your email')
    const email = originalArgs?.email || ''
    router.push(`/auth/signUp/emailSent?email=${encodeURIComponent(email)}`)
  }

  return (
    <div>
      <Header isAuth />
      <FormSignUp onSubmit={onSubmitSignUp} onSignGoogle={onSignGoogle} onSignGit={onSignGit} />
    </div>
  )
}

export default SignUp
