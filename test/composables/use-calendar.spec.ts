import { useCalendar } from '../../src/composables'

describe('useCalendar', () => {
  describe('current display date', () => {
    it('if defaultDate prop is specified, it should be defaultDate prop', () => {
      const { currentDisplayDate } = useCalendar({ modelValue: null, defaultDate: new Date('2022-05-01') })
      expect(currentDisplayDate.value).toEqual(new Date('2022-05-01'))
    })

    it('if modelValue prop is specified, it should be modelValue prop', () => {
      const { currentDisplayDate } = useCalendar({ modelValue: new Date('2022-07-01') })
      expect(currentDisplayDate.value).toEqual(new Date('2022-07-01'))
    })

    it('modelValue prop and defaultDate prop, modelValue must be given priority', () => {
      const { currentDisplayDate } = useCalendar({
        modelValue: new Date('2022-07-01'),
        defaultDate: new Date('2022-05-01'),
      })
      expect(currentDisplayDate.value).toEqual(new Date('2022-07-01'))
    })
  })

  it('currentDisplayYear should be able to be retrieved from currentDisplayDate', () => {
    const { currentDisplayYear } = useCalendar({ modelValue: null, defaultDate: new Date('2022-05-10') })
    expect(currentDisplayYear.value).toBe(2022)
  })

  it('currentDisplayMonth should be able to be retrieved from currentDisplayDate', () => {
    const { currentDisplayMonth } = useCalendar({ modelValue: null, defaultDate: new Date('2022-05-10') })
    expect(currentDisplayMonth.value).toBe(5)
  })

  it('currentDisplayFirstOfMonth should be able to be retrieved from currentDisplayDate', () => {
    const { currentDisplayFirstOfMonth } = useCalendar({ modelValue: null, defaultDate: new Date('2022-05-10') })
    const firstOfMonth = currentDisplayFirstOfMonth.value.setMinutes(
      -currentDisplayFirstOfMonth.value.getTimezoneOffset()
    )
    expect(firstOfMonth).toEqual(new Date('2022-05-01').getTime())
  })

  it('currentDisplayLastDayOfMonth should be able to be retrieved from currentDisplayDate', () => {
    const { currentDisplayLastDayOfMonth } = useCalendar({ modelValue: null, defaultDate: new Date('2022-05-10') })
    const lastDayOfMonth = currentDisplayLastDayOfMonth.value.setMinutes(
      -currentDisplayLastDayOfMonth.value.getTimezoneOffset()
    )
    expect(lastDayOfMonth).toEqual(new Date('2022-05-31').getTime())
  })

  it('previousDisplayMonth should be able to get the last month of currentDisplayDate', () => {
    const { previousDisplayMonth } = useCalendar({ modelValue: null, defaultDate: new Date('2022-05-10') })
    expect(previousDisplayMonth.value).toEqual(new Date('2022-04-10'))
  })

  it('nextDisplayMonth should be able to get the next month of currentDisplayDate', () => {
    const { nextDisplayMonth } = useCalendar({ modelValue: null, defaultDate: new Date('2022-05-10') })
    expect(nextDisplayMonth.value).toEqual(new Date('2022-06-10'))
  })

  it('calendar data for the relevant month should be returned (starting on Sunday)', () => {
    const { calendarData, currentDisplayFirstOfMonth } = useCalendar({
      modelValue: null,
      defaultDate: new Date('2022-08-15'),
      from: new Date('2022-08-11'),
      to: new Date('2022-08-30'),
    })
    const offset = -currentDisplayFirstOfMonth.value.getTimezoneOffset()
    const startDate = new Date('2022-07-31')

    calendarData.value.forEach((week, index) => {
      const baseAddDate = startDate.getDate() + index * 7
      expect(week.map((date) => new Date(date.date.setMinutes(offset)))).toEqual([
        new Date(new Date(startDate).setDate(baseAddDate)),
        new Date(new Date(startDate).setDate(baseAddDate + 1)),
        new Date(new Date(startDate).setDate(baseAddDate + 2)),
        new Date(new Date(startDate).setDate(baseAddDate + 3)),
        new Date(new Date(startDate).setDate(baseAddDate + 4)),
        new Date(new Date(startDate).setDate(baseAddDate + 5)),
        new Date(new Date(startDate).setDate(baseAddDate + 6)),
      ])

      switch (index) {
        case 0:
          expect(week.map((date) => date.isActive)).toEqual([false, false, false, false, false, false, false])
          break
        case 1:
          expect(week.map((date) => date.isActive)).toEqual([false, false, false, false, true, true, true])
          break
        case 2:
        case 3:
          expect(week.map((date) => date.isActive)).toEqual([true, true, true, true, true, true, true])
          break
        case 4:
          expect(week.map((date) => date.isActive)).toEqual([true, true, true, false, false, false, false])
          break
      }
    })
  })
})
