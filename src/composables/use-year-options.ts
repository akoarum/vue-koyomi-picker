import { ref, computed } from 'vue'
import type { ComputedRef } from 'vue'

export const useYearOptions = (currentDisplayYear: ComputedRef<number>, props?: { from?: Date; to?: Date }) => {
  const isVisibleYearOptions = ref(false)

  const yearOptions = computed(() => {
    const fromYear = props && props.from ? props.from.getFullYear() : null
    const toYear = props && props.to ? props.to.getFullYear() : null
    const start = fromYear && fromYear > currentDisplayYear.value - 5 ? fromYear : currentDisplayYear.value - 5
    const end = toYear && toYear < currentDisplayYear.value + 5 ? toYear : currentDisplayYear.value + 5
    return new Array(end - start + 1).fill(null).map((_, i) => i + start)
  })

  const toggleYearOptions = () => {
    isVisibleYearOptions.value = !isVisibleYearOptions.value
  }

  return {
    isVisibleYearOptions,
    yearOptions,
    toggleYearOptions,
  }
}
