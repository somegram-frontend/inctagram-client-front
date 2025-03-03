import { DropdownMenu as DropdownMenuPrimitive } from 'radix-ui'
import { ElementRef, forwardRef } from 'react'
import { DropdownMenuContentProps, DropdownMenuItemProps } from '@radix-ui/react-dropdown-menu'
import s from './DropDown.module.scss'
import clsx from 'clsx'

/**
 * Компонент DropdownMenu, который отображает выпадающее меню с различными интерактивными элементами.
 * Пример
 *
 * @component
 * @example
 * return (
 *   <DropdownMenu>
 *     <DropdownMenuTrigger>Триггер выпадающего меню</DropdownMenuTrigger>
 *     <DropdownMenuContent>
 *       <DropdownMenuItem>Элемент</DropdownMenuItem>
 *       <DropdownMenuLabel>Метка</DropdownMenuLabel>
 *       <DropdownMenuGroup>Группа</DropdownMenuGroup>
 *       <DropdownMenuSeparator>Разделитель</DropdownMenuSeparator>
 *     </DropdownMenuContent>
 *   </DropdownMenu>
 * )
 */
export const DropdownMenu = DropdownMenuPrimitive.Root //Главная обертка всех компонент (container)!!!
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

export const DropdownMenuContent = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Content>,
  DropdownMenuContentProps
>(({ children, className, ...props }, forwardedRef) => {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        className={clsx(s.DropdownMenuContent, className)}
        {...props}
        ref={forwardedRef}
      >
        {children}
        <DropdownMenuPrimitive.Arrow className={clsx(s.DropdownMenuArrow)} />
      </DropdownMenuPrimitive.Content>
    </DropdownMenuPrimitive.Portal>
  )
})
DropdownMenuContent.displayName = 'DropdownMenuContent'

export const DropdownMenuLabel = DropdownMenuPrimitive.Label

export const DropdownMenuItem = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Item>,
  DropdownMenuItemProps
>(({ children, className, ...props }, forwardRef) => {
  return (
    <DropdownMenuPrimitive.Item
      className={clsx(s.DropdownMenuItem, className)}
      {...props}
      ref={forwardRef}
    >
      {children}
    </DropdownMenuPrimitive.Item>
  )
})
DropdownMenuItem.displayName = 'DropdownMenuItem'

export const DropdownMenuGroup = DropdownMenuPrimitive.Group

export const DropdownMenuSeparator = DropdownMenuPrimitive.Separator
