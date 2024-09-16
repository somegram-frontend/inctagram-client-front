'use client'
import { useLogoutMutation } from '@/api/auth-api'
import { Button, LogOut as LogOutIcon } from '@honor-ui/inctagram-ui-kit'
import s from './logOut.module.scss'
import { Dialog, DialogClose, DialogContent, DialogTrigger } from '@/components/dialog/Dialog'

type Props = {
  email: string
}

const LogOut = ({ email }: Props) => {
  const [logout, { isLoading }] = useLogoutMutation()

  const onClickHandler = () => {
    logout()
      .unwrap()
      .then(() => {
        if (isLoading) {
          return <h2>Loading</h2>
        }
      })
      .catch(e => {
        console.log(e)
      })
  }

  return (
    <Dialog>
      <DialogTrigger className={s.triggerButton}>
        <LogOutIcon /> Log Out
      </DialogTrigger>
      <DialogContent title={'Log Out'}>
        <div className={s.main}>
          <span className={s.text}>Are you really want to log out of your account {email}?</span>
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
