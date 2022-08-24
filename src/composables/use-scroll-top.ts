import { ref } from 'vue'

export const useScrollTop = () => {
  let cullTime: number | null = null
  const scrollTop = ref(0)

  const updateScrollTop = () => {
    scrollTop.value = window.scrollY
  }

  const onScroll = () => {
    if (typeof window === 'undefined') return
    if (cullTime) window.clearTimeout(cullTime)
    cullTime = window.setTimeout(() => {
      updateScrollTop()
    }, 20)
  }

  const initialize = () => {
    if (typeof window === 'undefined') return
    window.addEventListener('scroll', onScroll)
  }

  const destroy = () => {
    if (typeof window === 'undefined') return
    window.removeEventListener('scroll', onScroll)
  }

  return {
    scrollTop,
    initialize,
    destroy,
  }
}
