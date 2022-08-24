import { reactive } from 'vue'

export type WindowSize = {
  windowWidth: number
  windowHeight: number
}

export const useWindowSize = () => {
  let cullTime: number | null = null
  const windowSize = reactive<WindowSize>({
    windowWidth: 0,
    windowHeight: 0,
  })

  const updateWindowSize = () => {
    if (typeof window === 'undefined') return
    windowSize.windowWidth = window.innerWidth
    windowSize.windowHeight = window.innerHeight
  }

  const onResize = () => {
    if (cullTime) clearTimeout(cullTime)
    cullTime = window.setTimeout(() => {
      updateWindowSize()
    }, 80)
  }

  const initialize = () => {
    if (typeof window === 'undefined') return
    updateWindowSize()
    window.addEventListener('resize', onResize)
  }

  const destroy = () => {
    if (typeof window === 'undefined') return
    window.removeEventListener('resize', onResize)
  }

  return {
    windowSize,
    updateWindowSize,
    initialize,
    destroy,
  }
}
