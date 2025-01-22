'use client'
import { useRouter } from 'next/router'
import FormSignUp, { SignUpForm } from './formSingUp'
import { useRegistrationMutation } from '@/api/auth/auth-api'
import { emailTemplateConfirmEmail } from '../../../shared/templates/emails/emailTemplateConfirmEmail'
import { RegistrationArgs, RegistrationResponse } from '@/api/auth/auth-api.types'
import { toast } from 'react-toastify'
import { useAuthRedirect } from '@/shared/hooks/useAuthRedirect'
import { Loader } from '@/components/loader'
import Layout from '@/layout'

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
      const errorEmailMessage = 'User with this email is already registered'
      const errorUserMessage = 'User with this username is already registered'

      toast.error(errorEmailMessage)
      toast.error(errorUserMessage)
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
    <Layout>
      <FormSignUp onSubmit={onSubmitSignUp} onSignGoogle={onSignGoogle} onSignGit={onSignGit} />
    </Layout>
  )
}

export default SignUp
