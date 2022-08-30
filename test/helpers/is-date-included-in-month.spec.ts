import { isDateIncludedInSameMonth } from '../../src/helpers/is-date-included-in-same-month'

describe('isDateIncludedInSameMonth', () => {
  it('should return true if the given date is within the same month', () => {
    expect(isDateIncludedInSameMonth(new Date('2022-06-05'), new Date('2022-06-01'))).toBe(true)
  })

  it('should return false if the given date is another month', () => {
    expect(isDateIncludedInSameMonth(new Date('2022-06-05'), new Date('2022-07-01'))).toBe(false)
  })
})
