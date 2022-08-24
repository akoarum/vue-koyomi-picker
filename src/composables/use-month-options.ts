import { computed } from 'vue'
import type { ComputedRef } from 'vue'
import type { SelectOption } from '../components'

export const useMonthOptions = (currentDisplayYear: ComputedRef<number>, props?: { from?: Date; to?: Date }) => {
  const monthOptions = computed<SelectOption[]>(() => {
    const currentDisplayYearAfterFrom = props && props.from ? props.from.getFullYear() < currentDisplayYear.value : true
    const currentDisplayYearBeforeTo = props && props.to ? props.to.getFullYear() > currentDisplayYear.value : true
    let options: SelectOption[] = new Array(12).fill(null).map((_, i) => ({
      value: i + 1,
      isActive: true,
    }))

    if (!currentDisplayYearAfterFrom && props && props.from) {
      const activeMonth = props.from.getMonth()
      options = options.map((option) => {
        if (option.value - 1 >= activeMonth) return option
        return { ...option, isActive: false }
      })
    }

    if (!currentDisplayYearBeforeTo && props && props.to) {
      const activeMonth = props.to.getMonth()
      options = options.map((option) => {
        if (option.value - 1 <= activeMonth) return option
        return { ...option, isActive: false }
      })
    }

    return options
  })

  return {
    monthOptions,
  }
}
