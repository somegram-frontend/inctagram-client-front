import {
  Control,
  FieldValues,
  UseControllerProps,
  useController,
  useFormState,
} from 'react-hook-form'
import { DatePicker, DatePickerProps } from '../datePicker'

type ControlledDatePickerProps<T extends FieldValues> = {
  control: Control<T>
  trigger: (name: keyof T) => void
  label?: string
  className?: string
} & Omit<DatePickerProps, 'name' | 'value' | 'onChange'> &
  Omit<UseControllerProps<T>, 'control'>

export const ControlledDatePicker = <T extends FieldValues>({
  className,
  control,
  name,
  shouldUnregister,
  trigger,
  errorMessage,
  ...rest
}: ControlledDatePickerProps<T>) => {
  const {
    field: { onChange, value },
  } = useController({
    control,
    name,
    shouldUnregister,
  })

  const { errors } = useFormState({ control })
  const error = (errors[name]?.message || errorMessage) as string

  return (
    <div className={className}>
      <DatePicker
        {...rest}
        name={name}
        startDate={value}
        onChange={date => {
          onChange(date)
          trigger(name)
        }}
        errorMessage={error}
      />
    </div>
  )
}
