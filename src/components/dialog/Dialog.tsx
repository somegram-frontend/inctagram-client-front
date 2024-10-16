import { ElementRef, forwardRef, ComponentPropsWithoutRef } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import s from './dialog.module.scss'
import { Button, CloseOutline, Typography } from '@honor-ui/inctagram-ui-kit'

type Props = {
  title?: string
  customTitle?: string
} & ComponentPropsWithoutRef<typeof DialogPrimitive.Content>

export const DialogContent = forwardRef<ElementRef<typeof DialogPrimitive.Content>, Props>(
  ({ children, title, customTitle, ...props }: Props, ref) => (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className={s.overlay} />
      <DialogPrimitive.Content
        {...props}
        ref={ref}
        className={s.dialogContent}
        aria-describedby={undefined}
      >
        {title && (
          <div className={s.header}>
            <DialogPrimitive.Title>
              <Typography variant={'h1'}>{title}</Typography>
            </DialogPrimitive.Title>
            <DialogPrimitive.Close aria-label="Close">
              <CloseOutline className={s.iconButton} />
            </DialogPrimitive.Close>
          </div>
        )}
        {customTitle && (
          <Button>Next</Button>
        )}
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
)

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogClose = DialogPrimitive.Close

DialogContent.displayName = 'DialogContent'
