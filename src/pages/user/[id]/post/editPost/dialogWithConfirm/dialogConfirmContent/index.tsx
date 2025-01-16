import { DialogContent, DialogClose, Dialog } from '@/components/dialog'
import { ComponentPropsWithoutRef } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Button } from '@honor-ui/inctagram-ui-kit'
import s from '../dialogWithConfirm.module.scss'

type Props = {
  title: string
  description: string
  onClose: (value: boolean) => void
} & ComponentPropsWithoutRef<typeof DialogPrimitive.Content>

const DialogConfirmContent = ({ title, description, onClose }: Props) => {
  const onCloseDialogHandler = () => {
    onClose(false)
  }
  return (
    <Dialog>
      <DialogContent title={title}>
        <div className={s.contentContainer}>
          <p>{description}</p>
          <div className={s.buttonsContainer}>
            <Button onClick={onCloseDialogHandler}>Yes</Button>
            <DialogClose>
              <Button>No</Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DialogConfirmContent
