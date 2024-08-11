import { useRouter } from 'next/router'
import { Button, Cards, Close, Typography } from '@honor-ui/inctagram-ui-kit'
import '@honor-ui/inctagram-ui-kit/css'
import s from './email-sent.module.scss'

const EmailSent = () => {
  const router = useRouter()
  const { email } = router.query

  const onClickHandler = () => {
    router.push('/ui/auth/signUp')
  }

  return (
    <Cards className={s.main}>
      <div className={s.title}>
        <Typography as="h1" variant="h1">
          Email sent
        </Typography>
        <Close onClick={onClickHandler} />
      </div>
      <Typography as="p" variant="regular_text16" className={s.text}>
        We have sent a link to confirm your email to {email}
      </Typography>
      <Button onClick={onClickHandler} className={s.button}>
        OK
      </Button>
    </Cards>
  )
}

export default EmailSent
