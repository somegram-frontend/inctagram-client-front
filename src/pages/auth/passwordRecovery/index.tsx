import { Button, Typography } from '@honor-ui/inctagram-ui-kit'
import s from './emailVerification.module.scss'
import Image from 'next/image'
import verification from '/public/emailVerificationImage.png'
import router from 'next/router'

const EmailVerification = () => {
  const onSubmit = () => {
    router.push('/auth/forgotPassword')
  }
  return (
    <div className={s.main}>
      <Typography as={'h1'} variant="h1" className={s.title}>
        Email verification link expired
      </Typography>
      <Typography as={'p'} variant="regular_text16" className={s.subTitle}>
        Looks like the verification link has expired. Not to worry, we can send the link again
      </Typography>
      <Button className={s.button} onClick={onSubmit}>
        Resend link
      </Button>
      <Image src={verification} alt="background image" width={472} height={352} />
    </div>
  )
}

export default EmailVerification
