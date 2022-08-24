import { useScrollTop } from '../../src/composables'

describe('useScrollTop', () => {
  const spyAddEventListener = jest.spyOn(window, 'addEventListener')
  const spyRemoveEventListener = jest.spyOn(window, 'removeEventListener')

  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    spyAddEventListener.mockClear()
    spyRemoveEventListener.mockClear()
  })

  describe('initialize', () => {
    it('event listener should be registered', () => {
      const { initialize } = useScrollTop()
      initialize()
      expect(spyAddEventListener).toHaveBeenCalled()
    })
  })

  describe('destroy', () => {
    it('event listener should be removed', () => {
      const { initialize, destroy } = useScrollTop()
      initialize()
      destroy()
      expect(spyRemoveEventListener).toHaveBeenCalled()
    })
  })
})
