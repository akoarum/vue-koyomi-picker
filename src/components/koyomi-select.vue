<template>
  <div class="koyomi-select">
    <button
      ref="handler"
      :id="`koyomi-select-${id}`"
      :ariaExpanded="String(isVisible)"
      :aria-controls="`koyomi-select-options-${id}`"
      type="button"
      class="koyomi-select__handler"
      @click="toggleVisible"
    >
      {{ props.modelValue }}
    </button>
    <teleport :to="props.teleportTo">
      <transition name="option">
        <div
          v-if="isVisible"
          :id="`koyomi-select-options-${id}`"
          :aria-labelledby="`koyomi-select-${id}`"
          :ariaHidden="String(!isVisible)"
          :style="optionsStyle"
          class="koyomi-select__options"
        >
          <ul class="koyomi-select__option-list">
            <li v-for="option in props.options" :key="option.value" class="koyomi-select__option">
              <button
                ref="option"
                :disabled="!option.isActive"
                :ariaSelected="String(option.value === props.modelValue)"
                role="option"
                type="button"
                class="koyomi-select__option-button"
                @keydown="onKeydownOnOption"
                @click="onChange(option.value)"
              >
                {{ option.value }}
              </button>
            </li>
          </ul>
        </div>
      </transition>
      <div v-if="isVisible" class="koyomi-picker__layer" @click="toggleVisible" />
    </teleport>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, computed, defineProps, defineEmits, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import type { SelectOption } from '../types'

type Props = {
  modelValue: number
  options: SelectOption[]
  teleportTo: string
  windowWidth: number
  windowHeight: number
  windowScrollTop: number
}

type Emits = {
  (e: 'update:modelValue', value: number): void
}

type Rects = {
  handlerTop: number
  handlerLeft: number
  handlerWidth: number
  handlerHeight: number
}

const id = uuidv4()
const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const isVisible = ref(false)
const rects = reactive<Rects>({
  handlerTop: 0,
  handlerLeft: 0,
  handlerWidth: 0,
  handlerHeight: 0,
})
const handler = ref<HTMLButtonElement | null>(null)
const option = ref<HTMLButtonElement[] | null>(null)

const toggleVisible = () => {
  isVisible.value = !isVisible.value

  const { top, left, width, height } = getHandlerRect()
  rects.handlerTop = top
  rects.handlerLeft = left
  rects.handlerWidth = width
  rects.handlerHeight = height
}

const getHandlerRect = (): { top: number; left: number; width: number; height: number } => {
  if (!handler.value) return { top: 0, left: 0, width: 0, height: 0 }
  const rect = handler.value.getClientRects()[0]
  return {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
  }
}

const optionsStyle = computed<{ [key: string]: string }>(() => {
  const top = rects.handlerHeight + rects.handlerTop + 4
  const left = rects.handlerLeft
  const height = props.windowHeight - top - 20

  return {
    top: `${top}px`,
    left: `${left}px`,
    maxHeight: `${height}px`,
  }
})

const getOptionClasses = (value: number): string[] => {
  const classes: string[] = []
  if (props.modelValue === value) classes.push('is-selected')
  return classes
}

const onScroll = () => {
  const { top, left, width, height } = getHandlerRect()
  rects.handlerTop = top
  rects.handlerLeft = left
  rects.handlerWidth = width
  rects.handlerHeight = height
}

const focusIndex = ref<number>(0)
const focusableOptionLength = computed(() => props.options.filter((option) => option.isActive).length)

const onKeydownOnWindow = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'Escape':
      isVisible.value = false
      break
  }
}

const onKeydownOnOption = (event: KeyboardEvent) => {
  if (!option.value || !option.value.length) return

  switch (event.key) {
    case 'ArrowDown':
      focusIndex.value = (focusIndex.value + 1) % focusableOptionLength.value
      event.preventDefault()
      break
    case 'ArrowUp':
      focusIndex.value = focusIndex.value === 0 ? focusableOptionLength.value - 1 : focusIndex.value - 1
      event.preventDefault()
      break
    case 'Home':
      focusIndex.value = 0
      event.preventDefault()
      break
    case 'End':
      focusIndex.value = focusableOptionLength.value - 1
      event.preventDefault()
      break
    case 'Tab':
      event.preventDefault()
      break
    default:
      return
  }

  option.value[focusIndex.value].focus()
}

const updateFocus = (isVisible: boolean) => {
  if (isVisible) {
    const $target = option.value
    if (!$target || !$target.length) return
    $target[focusIndex.value].focus()
  } else {
    const $target = handler.value
    if (!$target) return
    $target.focus()
  }
}

watch(isVisible, (value) => {
  if (typeof window === 'undefined') return
  if (value) {
    window.addEventListener('keydown', onKeydownOnWindow)
  } else {
    window.removeEventListener('keydown', onKeydownOnWindow)
  }

  nextTick(() => {
    updateFocus(value)

    if (!value) focusIndex.value = props.options.findIndex((option) => option.value === props.modelValue)
  })
})

watch(
  () => props.windowScrollTop,
  () => {
    onScroll()
  }
)

const onChange = (value: number) => {
  emits('update:modelValue', value)
  isVisible.value = false
}

onMounted(() => {
  focusIndex.value = props.options.findIndex((option) => option.value === props.modelValue)
})

onBeforeUnmount(() => {
  if (typeof window === 'undefined') return
  window.removeEventListener('keydown', onKeydownOnWindow)
})
</script>

<script lang="ts">
export default {
  name: 'KoyomiSelect',
}
</script>

<style lang="scss" scoped>
.koyomi-select__handler {
  box-shadow: none;
  border-radius: 3px;
  border: none;
  padding: 8px 12px;
  background: transparent;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover,
  &:focus-visible {
    background: var(--vue-koyomi-primary-light);
  }
}

.koyomi-select__options {
  overflow-y: auto;
  position: fixed;
  z-index: 12000;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  background: var(--vue-koyomi-white);
  transition: top 0.3s ease;
  will-change: top;
}

.koyomi-select__option-list {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

.koyomi-select__option {
  vertical-align: top;
  line-height: 1;
}

.koyomi-select__option-button {
  box-shadow: none;
  border-radius: 0;
  border: none;
  box-sizing: border-box;
  padding: 9px 12px;
  width: 100%;
  background: var(--vue-koyomi-white);
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: bold;
  line-height: 1;
  cursor: pointer;
  transition: background 0.3s ease;

  &[aria-selected='true'] {
    color: var(--vue-koyomi-primary);
  }

  &:disabled {
    color: #c9c9c9;
    cursor: not-allowed;

    &:hover,
    &:focus-visible {
      background: transparent;
    }
  }

  &:hover,
  &:focus-visible {
    background: var(--vue-koyomi-primary-light);
  }
}

.koyomi-picker__layer {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 11999;
  width: 100%;
  height: 100%;
}

.option-enter-active,
.option-leave-active {
  transition: opacity 0.3s ease;
}

.option-enter-from,
.option-leave-to {
  opacity: 0;
}
</style>
