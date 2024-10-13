'use client'
import { useLogoutMutation, useMeQuery } from '@/api/auth-api'
import { Button, LogOut as LogOutIcon } from '@honor-ui/inctagram-ui-kit'
import s from './logOut.module.scss'
import { Dialog, DialogClose, DialogContent, DialogTrigger } from '@/components/dialog/Dialog'

const LogOut = () => {
  const { data } = useMeQuery()

  const [logout] = useLogoutMutation()

  const onClickHandler = () => {
    logout()
      .unwrap()
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
          <span className={s.text}>
            Are you really want to log out of your account {data?.email}?
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
