'use client'
import { useRouter } from 'next/router'
import { Button, Typography } from '@honor-ui/inctagram-ui-kit'
import '@honor-ui/inctagram-ui-kit/css'
import s from './emailConfirm.module.scss'
import emailConfirm from '/public/emailConfirmImage.png'
import linkExpired from '/public/linkExpiredImage.png'
import Image from 'next/image'
import { useConformationMutation, useReconformationMutation } from '@/api/auth-api'
import { emailTemplateConfirmEmail } from '../emailTemplateConfirmEmail'
import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from '@/components/dialog/Dialog'
import { Loader } from '@/components/loader/Loader'
import { RegistrationResponse } from '@/api/auth-api.types'

const EmailConfirm = () => {
  const router = useRouter()
  const { token } = router.query
  const [conformation, { isLoading, error, data, isSuccess, isError }] = useConformationMutation()
  const [reconformation, { isSuccess: isSuccessReconformation, isError: isErrorReconformation }] =
    useReconformationMutation()
  const [isOpen, setIsOpen] = useState(true)
  useEffect(() => {
    if (token) {
      conformation({ token: token as string })
    }
  }, [token])

  isSuccess && toast.success('Registration completed successfully.')
  ;(isError || isErrorReconformation) &&
    toast.error((error as { data: RegistrationResponse })?.data?.message || 'Registration failed')
  isSuccessReconformation && toast.success('Registration completed successfully.\nCheck your email')

  const signInHandler = () => {
    isSuccess && router.push('/auth/signIn')
  }
  const expiredLinkHandler = () => {
    reconformation({ html: emailTemplateConfirmEmail, token: token as string })
    isSuccessReconformation && router.push('/auth/signUp/emailSent')
  }
  const close400 = () => {
    setIsOpen(false)
    router.push('/auth/signUp')
  }
  const close500 = () => {
    setIsOpen(false)
    router.push('/')
  }
  if (isLoading) {
    return <Loader />
  }
  const err = error as { data: RegistrationResponse }
  if (isSuccess) {
    return (
      <div className={s.main}>
        <Typography as="h1" variant="h1" className={s.title}>
          Congratulations!
        </Typography>
        <Typography as="p" variant="regular_text16">
          Your email has been confirmed
        </Typography>
        <Button onClick={signInHandler} className={s.button}>
          Sign In
        </Button>
        <Image src={emailConfirm} alt="background image" width={432} height={300} />
      </div>
    )
  }

  if ((error as { data: RegistrationResponse })?.data?.statusCode === 500) {
    return (
      <Dialog open={isOpen} onOpenChange={close500}>
        <DialogContent title="Error">
          <div className={s.dialog}>
            <p>{(error as { data: RegistrationResponse })?.data?.message}.</p>
            <p>Please try confirm your registration later.</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (
    (error as { data: RegistrationResponse })?.data?.statusCode === 404 ||
    (error as { data: RegistrationResponse })?.data?.statusCode === 422
  ) {
    return (
      <Dialog open={isOpen} onOpenChange={close400}>
        <DialogContent title="Error">
          <div className={s.dialog}>
            <p>{(error as { data: RegistrationResponse })?.data?.message}.</p>
            <p>Please re-register.</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }
  if ((error as { data: RegistrationResponse })?.data?.statusCode === 400) {
    return (
      <div className={s.main}>
        <Typography as="h1" variant="h1" className={s.title}>
          Email verification link expired
        </Typography>
        <Typography as="p" variant="regular_text16">
          Looks like the verification link has expired. Not to worry, we can send the link again
        </Typography>
        <Button onClick={expiredLinkHandler} className={s.button} fullWidth>
          Resend verification link
        </Button>
        <Image src={linkExpired} alt="background image" width={432} height={300} />
      </div>
    )
  }
}

export default EmailConfirm
