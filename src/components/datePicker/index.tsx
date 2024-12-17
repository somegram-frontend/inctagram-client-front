import React, {forwardRef} from 'react'
import ReactDatePicker, {type ReactDatePickerCustomHeaderProps} from 'react-datepicker'
import clsx from 'clsx'
import {format} from 'date-fns'
import {enGB} from 'date-fns/locale'
import s from './datePicker.module.scss'
import CalendarOutline from '../../../public/CalendarOutline'
import ChevronLeft from '../../../public/ChevronLeft'
import ChevronRight from '../../../public/ChevronRight'
import {Input, InputProps, Typography} from '@honor-ui/inctagram-ui-kit'
import Link from 'next/link'
import {useRouter} from 'next/router'

export type DatePickerProps = {
  disabled?: boolean
  endDate?: Date | undefined
  errorMessage?: string
  label?: string
  name?: string
  selectsRange?: boolean
  setEndDate?: (date: Date | undefined) => void
  setStartDate: (date: Date | undefined) => void
  startDate: Date | undefined
  onChange: (date: Date | null) => void
}

const RenderCustomInput = forwardRef<HTMLInputElement, InputProps>(
  ({className, name, disabled, errorMessage, label, ...rest}: InputProps, ref) => {
    const router = useRouter()
    const userId = router.query.id

    return (
      <>
        <Input
          ref={ref}
          name={name}
          className={clsx(s.dateInput, s.input, errorMessage && s.hasError, className)}
          icon={<CalendarOutline className={clsx(s.calendarIcon, errorMessage && s.hasError)}/>}
          label={label}
          disabled={disabled}
          {...rest}
        />
        {errorMessage && (
          <div className={s.hasError}>
            {errorMessage}
            <Typography
              as={Link}
              href={{
                pathname: '/privacyPolicy',
                query: {href: `user/${userId}/profile`, title: 'Back to Profile Settings'},
              }}
              variant={'medium_text14'}
            >
              Privacy Policy
            </Typography>
          </div>
        )}
      </>
    )
  }
)
RenderCustomInput.displayName = 'RenderCustomInput'

const RenderCustomHeader = ({
                              date,
                              decreaseMonth,
                              increaseMonth,
                            }: ReactDatePickerCustomHeaderProps) => {
  return (
    <div className={s.headerContainer}>
      <div className={s.monthsYear}>
        <Typography variant={'bold_text16'}>{format(date, 'dd.MM.yyyy')}</Typography>{' '}
      </div>
      <button className={s.button} onClick={decreaseMonth} type={'button'}>
        <ChevronLeft/>
      </button>
      <button className={s.button} onClick={increaseMonth} type={'button'}>
        <ChevronRight/>
      </button>
    </div>
  )
}

export const DatePicker = (props: DatePickerProps) => {
  const {
    disabled,
    name,
    endDate,
    errorMessage,
    label,
    setEndDate,
    setStartDate,
    startDate,
    onChange,
  } = props

  const onChangeHandler = (dates: [Date | null, Date | null] | Date | null) => {
    if (!dates) return

    if (Array.isArray(dates)) {
      if (dates.length !== 2) return

      const [start, end] = dates
      setStartDate(start || undefined)
      setEndDate?.(end || undefined)
    } else {
      setStartDate(dates || undefined)
    }
  }

  return (
    <div className={s.box}>
      <ReactDatePicker
        calendarClassName={s.calendar}
        calendarStartDay={1}
        className={s.datePicker}
        name={name}
        customInput={
          <RenderCustomInput disabled={disabled} errorMessage={errorMessage} label={label}/>
        }
        dateFormat={'dd.MM.yyyy'}
        dayClassName={() => s.dayDate}
        disabled={disabled}
        endDate={endDate}
        locale={enGB}
        onChange={date => {
          onChange(date)
          onChangeHandler(date)
        }}
        popperPlacement={'bottom-start'}
        renderCustomHeader={RenderCustomHeader}
        selected={startDate}
        toggleCalendarOnIconClick
      />
    </div>
  )
}

export default DatePicker
