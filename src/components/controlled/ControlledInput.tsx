import {
  Control,
  FieldValues,
  UseControllerProps,
  useController,
  useFormState,
} from 'react-hook-form'

import { Input, InputProps } from '@honor-ui/inctagram-ui-kit'

type Props<T extends FieldValues> = {
  control: Control<T>
  trigger: (name: keyof T) => void
} & Omit<InputProps, 'name' | 'onBlur' | 'onChange' | 'value'> &
  Omit<UseControllerProps<T>, 'control'>

export const ControlledInput = <T extends FieldValues>({
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
  const { errors } = useFormState({ control })
  return (
    <Input
      {...rest}
      onChange={e => {
        onChange(e)
        trigger(name)
      }}
      onBlur={() => trigger(name)}
      value={value}
      type={name.match(/password/i) ? 'password' : name === 'email' ? name : 'text'}
      errorMessage={errors[name]?.message as string}
    ></Input>
  )
}