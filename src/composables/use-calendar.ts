import { ref, computed } from 'vue'
import { startOfMonth, lastDayOfMonth, subMonths, addMonths, getWeekOfMonth, isBefore, isAfter } from 'date-fns'

export type Props = {
  modelValue: Date | null
  defaultDate?: Date
  from?: Date
  to?: Date
}

export type DateOption = {
  date: Date
  isActive: boolean
}

export const useCalendar = (props: Props) => {
  const currentDisplayDate = ref<Date>(props.defaultDate ? props.defaultDate : new Date())
  currentDisplayDate.value = props.modelValue ? props.modelValue : currentDisplayDate.value

  const currentDisplayYear = computed(() => currentDisplayDate.value.getFullYear())
  const currentDisplayMonth = computed(() => currentDisplayDate.value.getMonth() + 1)
  const currentDisplayFirstOfMonth = computed(() => startOfMonth(currentDisplayDate.value))
  const currentDisplayLastDayOfMonth = computed(() => lastDayOfMonth(currentDisplayDate.value))
  const previousDisplayMonth = computed(() => subMonths(currentDisplayDate.value, 1))
  const nextDisplayMonth = computed(() => addMonths(currentDisplayDate.value, 1))

  const getDateIsActive = (date: Date) => {
    const cloneFromDate = props.from ? new Date(props.from) : null
    const afterFromProp = cloneFromDate
      ? isAfter(date, new Date(cloneFromDate.setDate(cloneFromDate.getDate() - 1)))
      : true
    const beforeToProp = props.to ? isBefore(date, props.to) : true
    return afterFromProp && beforeToProp
  }

  const calendarData = computed<DateOption[][]>(() => {
    const data: DateOption[][] = []
    const countOfEndWeek = getWeekOfMonth(currentDisplayLastDayOfMonth.value)
    let date: Date = currentDisplayFirstOfMonth.value

    for (let weekNumber = 0; weekNumber < countOfEndWeek; weekNumber++) {
      let weekly: DateOption[] = []
      for (let day = 0; day < 7; day++) {
        if (weekNumber === 0 && day < date.getDay()) {
          date.setDate(date.getDate() - date.getDay())
        }

        weekly.push({
          date: new Date(date),
          isActive: getDateIsActive(date),
        })
        date.setDate(date.getDate() + 1)
      }
      data.push(weekly)
      weekly = []
    }

    return data
  })

  return {
    currentDisplayDate,
    currentDisplayYear,
    currentDisplayMonth,
    currentDisplayFirstOfMonth,
    currentDisplayLastDayOfMonth,
    previousDisplayMonth,
    nextDisplayMonth,
    calendarData,
  }
}
