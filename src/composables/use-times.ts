import { computed } from 'vue'
import { isSameDay, isSameHour } from 'date-fns'
import type { TimeOption } from '../types'

export type UseTimesProps = {
  selectedDate?: Date | null
  to?: Date
  from?: Date
  disabledHours?: number[]
  stepMinutes: number
}

export const useTimes = (props: UseTimesProps) => {
  const now = computed(() => {
    return new Date()
  })

  const currentDate = computed(() => {
    return props.selectedDate || now.value
  })

  const hourOptions = computed<TimeOption[]>(() => {
    let hourOptions = new Array(24).fill(null).map((_, index) => ({ value: index, isActive: true }))

    if (props.disabledHours && props.disabledHours.length) {
      hourOptions = hourOptions.map((option) => {
        if (props.disabledHours!.includes(option.value)) {
          return {
            ...option,
            isActive: false,
          }
        }
        return option
      })
    }

    if (props.from && isSameDay(props.from, currentDate.value)) {
      const startHour = props.from.getHours()
      hourOptions = hourOptions.map((option) => {
        if (option.value >= startHour) return option
        return {
          ...option,
          isActive: false,
        }
      })
    }

    if (props.to && isSameDay(props.to, currentDate.value)) {
      const lastHour = props.to.getHours()
      hourOptions = hourOptions.map((option) => {
        if (option.value <= lastHour) return option
        return {
          ...option,
          isActive: false,
        }
      })
    }

    return hourOptions
  })

  const minuteOptions = computed<TimeOption[]>(() => {
    const step = props.stepMinutes <= 0 ? 1 : props.stepMinutes
    let minuteOptions = new Array(Math.ceil(60 / step))
      .fill(null)
      .map((_, index) => ({ value: index * step, isActive: true }))

    if (props.from && isSameHour(props.from, currentDate.value)) {
      const startMinute = props.from.getMinutes()
      minuteOptions = minuteOptions.map((option) => {
        if (option.value >= startMinute) return option
        return {
          ...option,
          isActive: false,
        }
      })
    }

    if (props.to && isSameHour(props.to, currentDate.value)) {
      const lastMinute = props.to.getMinutes()
      minuteOptions = minuteOptions.map((option) => {
        if (option.value <= lastMinute) return option
        return {
          ...option,
          isActive: false,
        }
      })
    }

    return minuteOptions
  })

  return {
    currentDate,
    hourOptions,
    minuteOptions,
  }
}
