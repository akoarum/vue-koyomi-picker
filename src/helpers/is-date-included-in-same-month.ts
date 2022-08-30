import { isBefore, isAfter, startOfMonth, lastDayOfMonth } from 'date-fns'

export const isDateIncludedInSameMonth = (date: Date, dateToCompare: Date): boolean => {
  const startDate = startOfMonth(dateToCompare)
  const lastDate = lastDayOfMonth(dateToCompare)
  if (isAfter(date, startDate) && isBefore(date, lastDate)) return true
  return false
}
