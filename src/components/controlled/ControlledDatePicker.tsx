import { DatePicker } from '@honor-ui/inctagram-ui-kit'
import { Control, FieldValues, useController, UseControllerProps } from 'react-hook-form'

type DatePickerProps = {
  disabled?: boolean
  endDate?: Date | undefined
  errorMessage?: string
  label?: string
  selectsRange?: boolean
  setEndDate?: (date: Date | undefined) => void
  setStartDate: (date: Date | undefined) => void
  startDate: Date | undefined
}

type Props<T extends FieldValues> = {
  control: Control<T>
  trigger: (name: keyof T) => void
  name: keyof T
} & Omit<DatePickerProps, 'name' | 'onChange' | 'onBlur'> &
  Omit<UseControllerProps<T>, 'control'>

export const ControledDatePicker = <T extends FieldValues>({
  control,
  name,
  trigger,
  ...rest
}: Props<T>) => {
  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { error },
  } = useController({
    control,
    name,
  })

  return (
    <DatePicker
      {...rest}
      startDate={value}
      // onChange={(date: Date | undefined) => {
      //   onChange(date)
      //   trigger(name)
      // }}
      // onBlur={() => {
      //   onBlur()
      //   trigger(name)
      // }}
      errorMessage={error?.message}
    />
  )
}
