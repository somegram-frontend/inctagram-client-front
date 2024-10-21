import { DialogContent, DialogClose } from '@/components/dialog/Dialog'
import { ComponentPropsWithoutRef } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Button } from '@honor-ui/inctagram-ui-kit'
import style from './dialogWithConfirm.module.scss'

type Props = {
  title: string
  description: string
  onClose: (value: boolean) => void
} & ComponentPropsWithoutRef<typeof DialogPrimitive.Content>

export const DialogConfirmContent = ({ title, description, onClose }: Props) => {
  const onCloseDialogHandler = () => {
    onClose(false)
  }
  return (
    <DialogContent title={title}>
      <div className={style.contentContainer}>
        <p>{description}</p>
        <div className={style.buttonsContainer}>
          <Button onClick={onCloseDialogHandler}>Yes</Button>
          <DialogClose>
            <Button>No</Button>
          </DialogClose>
        </div>
      </div>
    </DialogContent>
  )
}
