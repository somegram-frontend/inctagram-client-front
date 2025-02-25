import {DropdownMenu as DropdownMenuPrimitive} from 'radix-ui'
import {ElementRef, forwardRef} from 'react'
import {DropdownMenuContentProps} from '@radix-ui/react-dropdown-menu'

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
>(({ children, ...props }, forwardedRef) => {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content {...props} ref={forwardedRef}>
        {children}
        <DropdownMenuPrimitive.Arrow />
      </DropdownMenuPrimitive.Content>
    </DropdownMenuPrimitive.Portal>
  )
})
DropdownMenuContent.displayName = 'DropdownMenuContent'

export const DropdownMenuLabel = DropdownMenuPrimitive.Label
export const DropdownMenuItem = DropdownMenuPrimitive.Item
export const DropdownMenuGroup = DropdownMenuPrimitive.Group

export const DropdownMenuSeparator = DropdownMenuPrimitive.Separator
