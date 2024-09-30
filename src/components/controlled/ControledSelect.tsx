import { ComponentPropsWithoutRef, ReactNode } from 'react'
import { Control, FieldValues, UseControllerProps, useController } from 'react-hook-form'
import { Select } from '../select'

export type Option = {
  label: ReactNode | string
  value: string
}

export type SelectProps = {
  className?: string
  label?: string
  onValueChange?: (value: string) => void
  options: Option[]
  placeholder?: ReactNode | string
  small?: boolean
} & ComponentPropsWithoutRef<typeof Select>

type Props<T extends FieldValues> = {
  control: Control<T>
} & Omit<SelectProps, 'onChange' | 'value'> &
  Omit<UseControllerProps<T>, 'control'>

export const ControlledSelect = <T extends FieldValues>({
  control,
  name,
  shouldUnregister,
  defaultValue,
  options,
  ...rest
}: Props<T>) => {
  const {
    field: { onChange, value },
  } = useController({
    control,
    name,
    shouldUnregister,
    defaultValue,
  })

  return (
    <Select
      options={options}
      onValueChange={onChange}
      value={value}
      defaultValue={defaultValue}
      {...rest}
    />
  )
}