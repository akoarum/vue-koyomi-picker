import { computed } from 'vue'
import { useMonthOptions } from '../../src/composables'

describe('useMonthOptions', () => {
  const year = computed(() => 2022)

  it('0 to 11 options should be obtainable', () => {
    const { monthOptions } = useMonthOptions(year)
    monthOptions.value.forEach((option, index) => {
      expect(option.month).toBe(index)
    })
  })

  it('if nothing is specified, should get options that are all active', () => {
    const { monthOptions } = useMonthOptions(year)
    expect(monthOptions.value.every((option) => option.isActive)).toBe(true)
  })

  describe('"from" prop is specified', () => {
    it('if it is not the relevant year, everything will be active', () => {
      const { monthOptions } = useMonthOptions(year, { from: new Date('2021-05-01') })
      expect(monthOptions.value.every((option) => option.isActive)).toBe(true)
    })

    it('if it is the relevant year, it will be disabled before the "from" month', () => {
      const { monthOptions } = useMonthOptions(year, { from: new Date('2022-05-01') })
      monthOptions.value.forEach((option) => {
        if (option.month < 4) {
          expect(option.isActive).toBe(false)
        } else {
          expect(option.isActive).toBe(true)
        }
      })
    })
  })

  describe('"to" prop is specified', () => {
    it('if it is not the relevant year, everything will be active', () => {
      const { monthOptions } = useMonthOptions(year, { to: new Date('2023-05-01') })
      expect(monthOptions.value.every((option) => option.isActive)).toBe(true)
    })

    it('if it is the relevant year, it will be disabled after the "to" month', () => {
      const { monthOptions } = useMonthOptions(year, { to: new Date('2022-10-01') })
      monthOptions.value.forEach((option) => {
        if (option.month > 9) {
          expect(option.isActive).toBe(false)
        } else {
          expect(option.isActive).toBe(true)
        }
      })
    })
  })

  describe('both props are specified', () => {
    it('only within a period of time should be active', () => {
      const { monthOptions } = useMonthOptions(year, { from: new Date('2022-04-01'), to: new Date('2022-10-15') })
      monthOptions.value.forEach((option) => {
        if (option.month > 2 && option.month < 10) {
          expect(option.isActive).toBe(true)
        } else {
          expect(option.isActive).toBe(false)
        }
      })
    })
  })

  it('toggle isVisible', () => {
    const { isVisibleMonthOptions, toggleMonthOptions } = useMonthOptions(year)
    expect(isVisibleMonthOptions.value).toBe(false)
    toggleMonthOptions()
    expect(isVisibleMonthOptions.value).toBe(true)
  })
})
