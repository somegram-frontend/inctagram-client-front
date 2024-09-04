'use client'
import { useRouter } from 'next/router'
import { Button, Typography } from '@honor-ui/inctagram-ui-kit'
import '@honor-ui/inctagram-ui-kit/css'
import s from './emailConfirm.module.scss'
import emailConfirm from '/public/emailConfirmImage.png'
import linkExpired from '/public/linkExpiredImage.png'
import Image from 'next/image'
import { differenceInMinutes, parseISO } from 'date-fns'
import { useConformationMutation, useReconformationMutation } from '@/api/auth-api'
import { emailTemplateConfirmEmail } from '../emailTemplateConfirmEmail'
import { toast } from 'react-toastify'

const EmailConfirm = () => {
  const [conformation, { isSuccess: isSuccessConformation, isError: isErrorConformation }] =
    useConformationMutation()
  const [reconformation, { isSuccess: isSuccessReconformation, isError: isErrorReconformation }] =
    useReconformationMutation()
  const router = useRouter()
  const params = router.query
  let expiredLink: number = 0
  let token: string
  if (params && params.expiredAt) {
    if (Array.isArray(params.expiredAt)) {
      return
    } else {
      const startDate = parseISO(params.expiredAt)
      const currentDate = new Date()
      expiredLink = 1440 + differenceInMinutes(currentDate, startDate)
      console.log(expiredLink)
      if (params && params.token) {
        if (Array.isArray(params.token)) {
          return
        } else {
          token = params.token
        }
      }
    }
  }

  isSuccessConformation && toast.success('Registration completed successfully.')
  ;(isErrorConformation || isErrorReconformation) && toast.error('Registration failed')
  isSuccessReconformation && toast.success('Registration completed successfully.\nCheck your email')

  const signInHandler = () => {
    conformation({ token })
    isSuccessConformation && router.push('/auth/signIn')
  }
  const expiredLinkHandler = () => {
    reconformation({ html: emailTemplateConfirmEmail, token })
    isSuccessReconformation && router.push('/auth/signUp/emailSent')
  }
  return (
    <>
      {expiredLink < 5 ? (
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
      ) : (
        <div>
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
        </div>
      )}
    </>
  )
}
export default EmailConfirm
