import { format, isToday, isYesterday, isThisWeek, isThisYear } from 'date-fns'

export const formatChatTime = (date: string): string => {
  if (isToday(date)) {
    return format(date, 'HH:mm')
  }

  if (isYesterday(date)) {
    return 'yesterday'
  }

  if (isThisWeek(date)) {
    return format(date, 'EEE')
  }

  if (isThisYear(date)) {
    return format(date, 'd MMM').toLowerCase()
  }

  return format(date, 'd MMM yyyy').toLowerCase()
}
