import { computed } from 'vue'
import { useYearOptions } from '../../src/composables'

describe('useYearOptions', () => {
  const year = computed(() => 2022)

  it('if nothing is specified, 5 years before and after should be included', () => {
    const { yearOptions } = useYearOptions(year)
    expect(yearOptions.value).toEqual([2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027])
  })

  describe('"before" and "to" props are specified', () => {
    it('should be included to that years', () => {
      const { yearOptions } = useYearOptions(year, { from: new Date('2020-05-01'), to: new Date('2025-10-31') })
      expect(yearOptions.value).toEqual([2020, 2021, 2022, 2023, 2024, 2025])
    })

    it('If it is more than 5 years ago or later, it should be up to 5 years before or after', () => {
      const { yearOptions } = useYearOptions(year, { from: new Date('2015-05-01'), to: new Date('2030-10-31') })
      expect(yearOptions.value).toEqual([2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027])
    })
  })

  it('toggle isVisible', () => {
    const { isVisibleYearOptions, toggleYearOptions } = useYearOptions(year)
    expect(isVisibleYearOptions.value).toBe(false)
    toggleYearOptions()
    expect(isVisibleYearOptions.value).toBe(true)
  })
})
