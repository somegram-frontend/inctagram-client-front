import { useLogoutMutation } from '@/api/auth-api'
import { useRouter } from 'next/router'
import { Button, Cards, CloseOutline, Typography } from '@honor-ui/inctagram-ui-kit'
import { MouseEvent } from 'react'
import s from './logOut.module.scss'
import { Dialog, DialogClose, DialogContent, DialogTrigger } from '@/components/dialog/Dialog'
import { LogOut as LogOutIcon } from '@honor-ui/inctagram-ui-kit'

const LogOut = () => {
  const router = useRouter()
  const [logout] = useLogoutMutation()

  const onClickHandler = (e: MouseEvent<HTMLButtonElement>) => {
    router.push('/ui/auth/signIn')
  }

  return (
    <Dialog>
      <DialogTrigger>
        <LogOutIcon /> Log Out
      </DialogTrigger>
      <DialogContent title={'Log Out'}>
        <div className={s.main}>
          <span className={s.text}>
            Are you really want to log out of your account ___email name___?
          </span>
          <div className={s.buttonContainer}>
            <Button onClick={onClickHandler} variant={'outlined'} className={s.button}>
              Yes
            </Button>
            <DialogClose>
              <Button className={s.button}>No</Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default LogOut
