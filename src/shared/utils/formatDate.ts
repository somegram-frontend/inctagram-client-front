import { format } from 'date-fns'

export const safeFormatDate = (date: string | undefined, formatDate = 'dd.MM.yyyy') => {
  return date ? format(date, formatDate) : ''
}
