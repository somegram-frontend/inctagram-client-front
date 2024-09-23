import ReactDatePicker, { type ReactDatePickerCustomHeaderProps } from 'react-datepicker'

import clsx from 'clsx'
import { format } from 'date-fns'
import { enGB } from 'date-fns/locale'

import InputStyles from '@honor-ui/inctagram-ui-kit'
import s from './datePicker.module.scss'

// import { CalendarOutline, ChevronLeft, ChevronRight } from '@honor-ui/inctagram-ui-kit'
import { CalendarOutline} from '@honor-ui/inctagram-ui-kit'

// import CalendarOutline from '../../assets/icons/CalendarOutline'
// import ChevronLeft from '../../assets/icons/ChevronLeft'
// import ChevronRight from '../../assets/icons/ChevronRight'
import { Input, type InputProps } from '@honor-ui/inctagram-ui-kit'
import { Typography } from '@honor-ui/inctagram-ui-kit'

export type DatePickerProps = {
  disabled?: boolean
  endDate?: Date | undefined
  errorMessage?: string
  label?: string
  selectsRange?: boolean
  setEndDate?: (date: Date | undefined) => void
  setStartDate: (date: Date | undefined) => void
  startDate: Date | undefined
}

export const DatePicker = (props: DatePickerProps) => {
  const {
    disabled,
    endDate,
    errorMessage,
    label,
    selectsRange,
    setEndDate,
    setStartDate,
    startDate,
  } = props

  const onChangeHandler = (dates: [Date | null, Date | null] | Date | null) => {
    if (!dates) {
      return
    }

    if (Array.isArray(dates)) {
      if (dates.length !== 2) {
        return
      }
      const [start, end] = dates

      setStartDate(start || undefined)
      setEndDate?.(end || undefined)
    } else {
      setStartDate(dates)
    }
  }

  return (
    <div className={s.box}>
      <ReactDatePicker
        calendarClassName={s.calendar}
        calendarStartDay={1}
        className={s.datePicker}
        customInput={
          <RenderCustomInput disabled={disabled} errorMessage={errorMessage} label={label} />
        }
        dateFormat={'dd/MM/yyyy'}
        dayClassName={() => s.dayDate}
        disabled={disabled}
        endDate={endDate}
        locale={enGB}
        onChange={onChangeHandler}
        popperPlacement={'bottom-start'}
        renderCustomHeader={RenderCustomHeader}
        selected={startDate}
        selectsMultiple={undefined}
        selectsRange={selectsRange || undefined}
        showPopperArrow={false}
        startDate={startDate}
        toggleCalendarOnIconClick
      />
    </div>
  )
}

const RenderCustomInput = ({ className, disabled, errorMessage, label, ...rest }: InputProps) => {
  return (
    <Input
      className={clsx(s.dateInput, InputStyles, errorMessage && s.hasError)}
      disabled={disabled}
      errorMessage={errorMessage}
      icon={<CalendarOutline className={clsx(s.calendarIcon, errorMessage && s.hasError)} />}
      label={label}
      {...rest}
    />
  )
}

const RenderCustomHeader = ({
  date,
  decreaseMonth,
  increaseMonth,
}: ReactDatePickerCustomHeaderProps) => {
  return (
    <div className={s.headerContainer}>
      <div className={s.monthsYear}>
        <Typography variant={'bold_text16'}>{format(date, 'LLLL y')}</Typography>{' '}
      </div>
      <button className={s.button} onClick={decreaseMonth} type={'button'}>
        {/* {<ChevronLeft />} */}
      </button>
      <button className={s.button} onClick={increaseMonth} type={'button'}>
        {/* {<ChevronRight />} */}
      </button>
    </div>
  )
}
