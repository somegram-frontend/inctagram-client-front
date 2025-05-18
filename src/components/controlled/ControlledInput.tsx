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
  trigger?: (name: keyof T) => void
} & Omit<InputProps, 'name' | 'onBlur' | 'onChange' | 'value'> &
  Omit<UseControllerProps<T>, 'control'>

export const ControlledInput = <T extends FieldValues>({
  control,
  name,
  shouldUnregister,
  trigger,
  errorMessage,
  ...rest
}: Props<T>) => {
  const {
    field: { onChange, value = '' },
  } = useController({
    control,
    name,
    shouldUnregister,
  })
  const { errors } = useFormState({ control })
  const error = (errors[name]?.message || errorMessage) as string

  return (
    <Input
      {...rest}
      onChange={e => {
        onChange(e)
        trigger && trigger(name)
      }}
      onBlur={() => trigger && trigger(name)}
      value={value}
      type={name.match(/password/i) ? 'password' : name === 'email' ? name : 'text'}
      errorMessage={error}
    ></Input>
  )
}
