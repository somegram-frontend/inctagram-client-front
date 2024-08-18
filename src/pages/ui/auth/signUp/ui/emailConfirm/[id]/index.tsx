import { useRouter } from 'next/router'
import { Button, Typography } from '@honor-ui/inctagram-ui-kit'
import '@honor-ui/inctagram-ui-kit/css'
import s from './emailConfirm.module.scss'
import confirm from '/public/emailConfirmImage.png'
import Image from 'next/image'
import { useParams } from 'next/navigation'

const EmailConfirm = () => {
  const router = useRouter()
  const param = useParams()
  if (param && param.id) {
    if (Array.isArray(param.id)) {
      return
    } else {
      param.id && localStorage.setItem('token', param.id)
    }
  }
  const onClickHandler = () => {
    router.push('/ui/auth/signIn')
  }
  return (
    <div className={s.main}>
      <Typography as="h1" variant="h1" className={s.title}>
        Congratulations!
      </Typography>
      <Typography as="p" variant="regular_text16">
        Your email has been confirmed
      </Typography>
      <Button onClick={onClickHandler} className={s.button}>
        Sign In
      </Button>
      <Image src={confirm} alt="background image" width={432} height={300} />
    </div>
  )
}

export default EmailConfirm
