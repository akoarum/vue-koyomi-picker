import { useTimes } from '../../src/composables'

describe('useTimes', () => {
  describe('hourOptions', () => {
    it('if not specified, options 0 to 23 should be returned', () => {
      const hourOptions = useTimes({ stepMinutes: 1 }).hourOptions.value
      expect(hourOptions.length).toBe(24)
      hourOptions.forEach((option, index) => {
        expect(option.value).toBe(index)
        expect(option.isActive).toBe(true)
      })
    })

    it('Hours within the range of disabledHours should be disabled', () => {
      const hourOptions = useTimes({ stepMinutes: 1, disabledHours: [0, 1, 2] }).hourOptions.value
      hourOptions.forEach((option, index) => {
        expect(option.isActive).toBe(!(index < 3))
      })
    })

    it('If day props.from is selected, it should be disabled before the time specified in props.from', () => {
      const hourOptions = useTimes({
        stepMinutes: 1,
        selectedDate: new Date('2022-08-01'),
        from: new Date('2022-08-01 05:00'),
      }).hourOptions.value
      hourOptions.forEach((option, index) => {
        expect(option.isActive).toBe(!(index < 5))
      })
    })

    it('If day props.to is selected, it should be disabled after the time specified in props.to', () => {
      const hourOptions = useTimes({
        stepMinutes: 1,
        selectedDate: new Date('2022-08-01'),
        to: new Date('2022-08-01 20:00'),
      }).hourOptions.value
      hourOptions.forEach((option, index) => {
        expect(option.isActive).toBe(!(index > 20))
      })
    })
  })

  describe('minuteOptions', () => {
    it('If stepMinutes is 1, you should return 60 minutes worth of Option', () => {
      const minuteOptions = useTimes({
        stepMinutes: 1,
      }).minuteOptions.value
      expect(minuteOptions.length).toBe(60)
      minuteOptions.forEach((option, index) => {
        expect(option.value).toBe(index)
        expect(option.isActive).toBe(true)
      })
    })

    it('If stepMinute is set to a number other than 1, return an option corresponding to that number', () => {
      const minuteOptions = useTimes({
        stepMinutes: 2,
      }).minuteOptions.value
      expect(minuteOptions.length).toBe(30)
      minuteOptions.forEach((option, index) => {
        expect(option.value).toBe(index * 2)
      })
    })

    it('If the selected date and hours match from, the out-of-range Minute should be disabled', () => {
      const minuteOptions = useTimes({
        stepMinutes: 1,
        from: new Date('2022-08-01 10:30'),
        selectedDate: new Date('2022-08-01 10:00'),
      }).minuteOptions.value
      minuteOptions.forEach((option, index) => {
        expect(option.isActive).toBe(!(index < 30))
      })
    })

    it('If the selected date and hours match to, the out-of-range Minute should be disabled', () => {
      const minuteOptions = useTimes({
        stepMinutes: 1,
        to: new Date('2022-08-01 20:30'),
        selectedDate: new Date('2022-08-01 20:00'),
      }).minuteOptions.value
      minuteOptions.forEach((option, index) => {
        expect(option.isActive).toBe(!(index > 30))
      })
    })
  })
})
