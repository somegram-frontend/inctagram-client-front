import React, { ElementRef, ComponentPropsWithoutRef } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import s from './dialog.module.scss'
import { CloseOutline, Typography } from '@honor-ui/inctagram-ui-kit'

export const DialogContent = React.forwardRef<
  ElementRef<typeof DialogPrimitive.Content>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ children, ...props }, forwardedRef) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className={s.overlay} />
    <DialogPrimitive.Content {...props} ref={forwardedRef} className={s.dialogContent}>
      <div className={s.header}>
        <Typography variant={'h1'}>{props.title}</Typography>
        <DialogPrimitive.Close aria-label="Close">
          <CloseOutline className={s.iconButton} />
        </DialogPrimitive.Close>
      </div>
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
))

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogClose = DialogPrimitive.Close

DialogContent.displayName = 'DialogContent'
