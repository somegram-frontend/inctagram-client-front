'use client'
import { useLogoutMutation } from '@/api/auth-api'
import { Button, LogOut as LogOutIcon } from '@honor-ui/inctagram-ui-kit'
import s from './logOut.module.scss'
import { Dialog, DialogClose, DialogContent, DialogTrigger } from '@/components/dialog'
import { Loader } from '@/components/loader'
import { RegistrationResponse } from '@/api/auth-api.types'
import { toast } from 'react-toastify'

type Props = {
  email: string | undefined
}

const LogOut = ({ email }: Props) => {
  const [logout, { isLoading, isSuccess, isError, error }] = useLogoutMutation()

  const onClickHandler = () => {
    logout()
  }

  if (isLoading)
    return (
      <div className={s.loader}>
        <Loader />
      </div>
    )

  if (isSuccess) {
    toast.success('You are logout successfully.')
  }

  if (isError) {
    const err = error as { data: RegistrationResponse }
    if (err.data?.details) {
      const errorMessage = `${err.data.details.email! || ''} ${err.data.details.username || ''}`
      errorMessage && toast.error(errorMessage)
    } else if (err.data?.errors) {
      const errorMessages = err.data.errors
        .map(e => Object.values(e.constraints).join(', '))
        .join('; ')
      errorMessages && toast.error(errorMessages)
    } else {
      toast.error(err.data?.message || 'Logout failed')
    }
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
