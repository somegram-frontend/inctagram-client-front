import { DialogTrigger, Dialog, DialogContent } from '@/components/dialog/Dialog'
import { ElementRef, forwardRef, ComponentPropsWithoutRef, useState } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { CloseOutline } from '@honor-ui/inctagram-ui-kit'
import s from '../../pages/user/uploadAvatar/uploadAvatar.module.scss'
import { DialogConfirmContent } from './DialogConfirmContent'
import style from './dialogWithConfirm.module.scss'
import { useUpdateUserPostMutation } from '@/api/posts-api'
import { Loader } from '../loader/Loader'

type Props = {
  title: string
  confirmTitle: string
  confirmDescription: string
  onClose: (value: boolean) => void
} & ComponentPropsWithoutRef<typeof DialogPrimitive.Content>

type PointerDownOutsideEvent = CustomEvent<{ originalEvent: PointerEvent }>
type FocusOutsideEvent = CustomEvent<{ originalEvent: FocusEvent }>

export const DialogWithConfirm = forwardRef<ElementRef<typeof DialogPrimitive.Content>, Props>(
  ({ children, title, confirmTitle, confirmDescription, onClose, ...props }: Props, ref) => {
    const [confirm, setConfirm] = useState(false)

    const outsideHandler = (event: PointerDownOutsideEvent | FocusOutsideEvent) => {
      event.preventDefault()
      setConfirm(true)
    }

    return (
      <DialogContent
        title={title}
        onInteractOutside={outsideHandler}
        withoutCloseIcon
        className={s.dialogContent}
      >
        <Dialog>
          <DialogTrigger asChild className={style.triggerBtn}>
            <CloseOutline className={s.iconButton} />
          </DialogTrigger>
          <DialogConfirmContent
            title={confirmTitle}
            description={confirmDescription}
            onClose={onClose}
          />
        </Dialog>
        {children}
        <Dialog open={confirm} onOpenChange={setConfirm}>
          <DialogConfirmContent
            title={confirmTitle}
            description={confirmDescription}
            onClose={onClose}
          />
        </Dialog>
      </DialogContent>
    )
  }
)
