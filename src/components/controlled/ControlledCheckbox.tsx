import { Control, FieldValues, UseControllerProps, useController } from 'react-hook-form'
import { Checkbox, CheckboxProps } from '@honor-ui/inctagram-ui-kit'

type Props<T extends FieldValues> = {
  control: Control<T>
  trigger: (name: keyof T) => void
} & Omit<CheckboxProps, 'name' | 'checked' | 'id' | 'onCheckedChange' | 'onBlur'> &
  Omit<UseControllerProps<T>, 'control'>

export const ControlledCheckbox = <T extends FieldValues>({
  control,
  name,
  shouldUnregister,
  trigger,
  ...rest
}: Props<T>) => {
  const {
    field: { onBlur, onChange, value },
  } = useController({
    control,
    name,
    shouldUnregister,
  })

  return (
    <Checkbox
      {...rest}
      checked={value}
      onBlur={() => trigger(name)}
      onCheckedChange={checked => {
        onChange(checked)
        trigger(name)
      }}
    ></Checkbox>
  )
}
