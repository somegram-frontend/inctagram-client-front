import { type ComponentPropsWithoutRef, type ElementRef, type ReactNode, forwardRef } from 'react'

import * as SelectRadix from '@radix-ui/react-select'
import clsx from 'clsx'

import s from './select.module.scss'
import * as ScrollArea from '@radix-ui/react-scroll-area';
import Icon from '../../../public/ArrowDown'

export type Option = {
    label: ReactNode | string
    value: string
}
export type SelectProps = {
    className?: string
    classNameContent?: string
    label?: string
    onValueChange?: (value: string) => void
    options: Option[]
    placeholder?: ReactNode | string
    small?: boolean
} & ComponentPropsWithoutRef<typeof SelectRadix.Root>

type Props = Omit<ComponentPropsWithoutRef<typeof SelectRadix.Root>, keyof SelectProps> &
    SelectProps
export const Select = forwardRef<ElementRef<typeof SelectRadix.Root>, Props>((props, ref) => {
    const {
        className,
        classNameContent,
        disabled,
        label,
        onValueChange,
        options,
        placeholder,
        small = false,
        value,
        ...rest
    } = props

    return (
        <label className={clsx(s.label, className)}>
            {label}
            <SelectRadix.Root onValueChange={onValueChange} value={value} {...rest}>
                <SelectRadix.Trigger
                    className={clsx(s.trigger, disabled && s.triggerDisabled, small && s.small)}
                    disabled={disabled}
                    ref={ref}
                >
                    <SelectRadix.Value placeholder={placeholder} />
                    <SelectRadix.Icon asChild className={'SelectIcon'}>
                        <Icon className={clsx(s.icon, disabled && s.iconDisabled)} name={'arrow'} />
                    </SelectRadix.Icon>
                </SelectRadix.Trigger>
                <SelectRadix.Portal>
                    <SelectRadix.Content className={clsx(s.content, classNameContent)} position={'popper'}>
                        <ScrollArea.Root className="ScrollAreaRoot" type="auto">
                            <SelectRadix.Viewport>
                                <ScrollArea.Viewport className="ScrollAreaViewport">
                                    {options.map(el => (
                                        <SelectRadix.Item
                                            className={clsx(s.item, small && s.small)}
                                            key={el.value}
                                            value={el.value}
                                        >
                                            <SelectRadix.ItemText>{el.label}</SelectRadix.ItemText>
                                        </SelectRadix.Item>
                                    ))}
                                </ScrollArea.Viewport>
                            </SelectRadix.Viewport>
                            <ScrollArea.Scrollbar
                                className="ScrollAreaScrollbar"
                                orientation="vertical"
                            >
                                <ScrollArea.Thumb className="ScrollAreaThumb" />
                            </ScrollArea.Scrollbar>
                        </ScrollArea.Root>
                    </SelectRadix.Content>
                </SelectRadix.Portal>
            </SelectRadix.Root>
        </label>
    )
})
