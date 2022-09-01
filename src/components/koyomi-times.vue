<template>
  <div ref="wrapperRef" class="koyomi-times">
    <div ref="hourRef" class="koyomi-times__col">
      <div class="koyomi-times__col-inner">
        <div v-for="hour in hourOptions" :key="hour.value" class="koyomi-times__time">
          <button
            ref="hourButtonRef"
            :disabled="!hour.isActive"
            :class="getHourClasses(hour.value)"
            type="button"
            class="koyomi-times__button"
            @click="onClickOnHour(hour.value)"
          >
            {{ hour.value }}
          </button>
        </div>
      </div>
    </div>
    <div ref="minuteRef" class="koyomi-times__col">
      <div class="koyomi-times__col-inner">
        <div v-for="minute in minuteOptions" :key="minute.value" class="koyomi-times__time">
          <button
            ref="minuteButtonRef"
            :disabled="!minute.isActive"
            :class="getMinuteClasses(minute.value)"
            type="button"
            class="koyomi-times__button"
            @click="onClickOnMinute(minute.value)"
          >
            {{ minute.value }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, withDefaults, watch, onMounted, nextTick } from 'vue'
import { isBefore, isAfter } from 'date-fns'
import { useTimes } from '../composables'

type Props = {
  selectedDate: Date | null
  to?: Date
  from?: Date
  disabledHours?: number[]
  stepMinutes?: number
}

type Emits = {
  (e: 'click:hour', hour: number): void
  (e: 'click:minute', minute: number): void
}

const props = withDefaults(defineProps<Props>(), {
  stepMinutes: 1,
})
const emits = defineEmits<Emits>()

const wrapperRef = ref<HTMLDivElement | null>()
const hourRef = ref<HTMLDivElement | null>()
const hourButtonRef = ref<HTMLButtonElement[] | null>()
const minuteRef = ref<HTMLDivElement | null>()
const minuteButtonRef = ref<HTMLButtonElement[] | null>()

const { currentDate, hourOptions, minuteOptions } = useTimes(props)

const updateSelectTimes = (newDate: Date) => {
  if (props.from && isBefore(newDate, props.from)) {
    onClickOnHour(props.from.getHours())
    onClickOnMinute(props.from.getMinutes())
  }

  if (props.to && isAfter(newDate, props.to)) {
    onClickOnHour(props.to.getHours())
    onClickOnMinute(props.to.getMinutes())
  }
}

watch(currentDate, (newDate: Date) => {
  updateSelectTimes(newDate)
})

const getHourClasses = (hour: number): string[] => {
  const classes: string[] = []
  if (currentDate.value.getHours() === hour) classes.push('is-selected')
  return classes
}

const getMinuteClasses = (minute: number): string[] => {
  const classes: string[] = []
  if (currentDate.value.getMinutes() === minute) classes.push('is-selected')
  return classes
}

const onClickOnHour = (hour: number) => {
  emits('click:hour', hour)
}

const onClickOnMinute = (minute: number) => {
  emits('click:minute', minute)
}

const setScrollPosition = () => {
  if (
    !wrapperRef.value ||
    !hourRef.value ||
    !hourButtonRef.value ||
    !hourButtonRef.value?.length ||
    !minuteRef.value ||
    !minuteButtonRef.value ||
    !minuteButtonRef.value?.length
  ) {
    return
  }
  const currentHourButton = hourButtonRef.value[currentDate.value.getHours()]
  const currentMinuteButton = minuteButtonRef.value[currentDate.value.getMinutes()]
  const rectsOfWrapper = wrapperRef.value.getClientRects()[0]
  const rectsOfHours = hourRef.value.getClientRects()[0]
  const rectsOfMinutes = minuteRef.value.getClientRects()[0]
  const rectsOfCurrentHourButton = currentHourButton.getClientRects()[0]
  const rectsOfCurrentMinuteButton = currentMinuteButton.getClientRects()[0]
  const adjustScrollTop = rectsOfWrapper.height / 2 - rectsOfCurrentHourButton.height / 2
  hourRef.value.scrollTop = rectsOfCurrentHourButton.top - rectsOfHours.top - adjustScrollTop
  minuteRef.value.scrollTop = rectsOfCurrentMinuteButton.top - rectsOfMinutes.top - adjustScrollTop
}

onMounted(() => {
  if (props.stepMinutes <= 0) {
    console.error('A number less than 0 is invalid for step prop. it is rendered as 1.')
  }

  nextTick(() => {
    setScrollPosition()
  })
})
</script>

<script lang="ts">
export default {
  title: 'KoyomiTimes',
}
</script>

<style lang="scss" scoped>
$bp: 440px;

.koyomi-times {
  display: flex;
}

.koyomi-times__col {
  overflow-y: auto;
  max-height: 325px;
  border-left: 1px solid var(--vue-koyomi-gray-border);
  line-height: 1;

  @media screen and (max-width: $bp) {
    width: 50%;
  }
}

.koyomi-times__time {
  padding: 2px 4px;
}

.koyomi-times__button {
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: none;
  box-sizing: border-box;
  border: none;
  border-radius: 4px;
  width: 48px;
  height: 24px;
  background: transparent;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 700;
  color: var(--vue-koyomi-black);
  transition: background 0.3s ease, color 0.3s ease;
  cursor: pointer;

  &:hover,
  &:focus-visible {
    background: var(--vue-koyomi-primary-light);
  }

  &.is-selected {
    background: var(--vue-koyomi-primary);
    color: var(--vue-koyomi-white);
  }

  &:disabled {
    color: #c9c9c9;
    cursor: not-allowed;

    &:hover,
    &:focus-visible {
      background: transparent;
    }
  }

  @media screen and (max-width: $bp) {
    width: 100%;
  }
}
</style>
