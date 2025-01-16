import { DialogTrigger, Dialog, DialogContent, DialogTitle } from '@/components/dialog'
import { ElementRef, forwardRef, ComponentPropsWithoutRef, useState } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { CloseOutline } from '@honor-ui/inctagram-ui-kit'
import s from './dialogWithConfirm.module.scss'
import DialogConfirmContent from './dialogConfirmContent'

type Props = {
  title: string
  confirmTitle: string
  confirmDescription: string
  onClose: (value: boolean) => void
} & ComponentPropsWithoutRef<typeof DialogPrimitive.Content>

type PointerDownOutsideEvent = CustomEvent<{ originalEvent: PointerEvent }>
type FocusOutsideEvent = CustomEvent<{ originalEvent: FocusEvent }>

const DialogWithConfirm = forwardRef<ElementRef<typeof DialogPrimitive.Content>, Props>(
  ({ children, title, confirmTitle, confirmDescription, onClose, ...props }: Props, ref) => {
    const [confirm, setConfirm] = useState(false)

    const outsideHandler = (event: PointerDownOutsideEvent | FocusOutsideEvent) => {
      event.preventDefault()
      setConfirm(true)
    }

    return (
      <Dialog>
        <DialogContent title={title} onInteractOutside={outsideHandler} withoutCloseIcon>
          <DialogTrigger asChild className={s.triggerBtn}>
            <CloseOutline onClick={() => onClose(false)} />
          </DialogTrigger>
          <DialogConfirmContent
            title={confirmTitle}
            description={confirmDescription}
            onClose={onClose}
          />
          {children}
          {/* <Dialog open={confirm} onOpenChange={setConfirm}>
            <DialogConfirmContent
              title={confirmTitle}
              description={confirmDescription}
              onClose={onClose}
            /> */}
        </DialogContent>
      </Dialog>
    )
  }
)

DialogWithConfirm.displayName = 'DialogWithConfirm'

export default DialogWithConfirm
