import { ElementRef, forwardRef, ComponentPropsWithoutRef } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import s from './dialog.module.scss'
import { CloseOutline, Typography } from '@honor-ui/inctagram-ui-kit'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

type Props = {
  title?: string
  description?: string
  withoutCloseIcon?: boolean
} & ComponentPropsWithoutRef<typeof DialogPrimitive.Content>

export const DialogContent = forwardRef<ElementRef<typeof DialogPrimitive.Content>, Props>(
  ({ children, title, description, withoutCloseIcon, ...props }: Props, ref) => (
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
            {!withoutCloseIcon && (
              <DialogPrimitive.Close aria-label="Close">
                <CloseOutline className={s.iconButton} />
              </DialogPrimitive.Close>
            )}
          </div>
        )}
        {description && (
          <VisuallyHidden asChild>
            <DialogPrimitive.Description>{description}</DialogPrimitive.Description>
          </VisuallyHidden>
        )}
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
)

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogClose = DialogPrimitive.Close
export const DialogTitle = DialogPrimitive.Title

DialogContent.displayName = 'DialogContent'
