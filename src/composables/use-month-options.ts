import { ref, computed } from 'vue'
import type { ComputedRef } from 'vue'

export type MonthOption = {
  month: number
  isActive: boolean
}

export const useMonthOptions = (currentDisplayYear: ComputedRef<number>, props?: { from?: Date; to?: Date }) => {
  const isVisibleMonthOptions = ref(false)

  const monthOptions = computed<MonthOption[]>(() => {
    const currentDisplayYearAfterFrom = props && props.from ? props.from.getFullYear() < currentDisplayYear.value : true
    const currentDisplayYearBeforeTo = props && props.to ? props.to.getFullYear() > currentDisplayYear.value : true
    let options: MonthOption[] = new Array(12).fill(null).map((_, i) => ({
      month: i,
      isActive: true,
    }))

    if (!currentDisplayYearAfterFrom && props && props.from) {
      const activeMonth = props.from.getMonth()
      options = options.map((option) => {
        if (option.month >= activeMonth) return option
        return { ...option, isActive: false }
      })
    }

    if (!currentDisplayYearBeforeTo && props && props.to) {
      const activeMonth = props.to.getMonth()
      options = options.map((option) => {
        if (option.month <= activeMonth) return option
        return { ...option, isActive: false }
      })
    }

    return options
  })

  const toggleMonthOptions = () => {
    isVisibleMonthOptions.value = !isVisibleMonthOptions.value
  }

  return {
    isVisibleMonthOptions,
    monthOptions,
    toggleMonthOptions,
  }
}
