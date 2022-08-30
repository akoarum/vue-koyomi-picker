<template>
  <div class="koyomi-picker">
    <div ref="activatorRef" class="koyomi-picker__activator">
      <slot name="activator" v-bind="{ on: onActivator, formattedValue }" />
    </div>

    <teleport :to="props.teleportTo">
      <transition name="koyomi-picker">
        <div v-if="isVisible" :style="contentStyle" class="koyomi-picker__content">
          <div :style="innerStyle" class="koyomi-picker__inner">
            <p class="koyomi-picker__selected-date">
              <time v-if="selectedDate" :datetime="format(selectedDate, 'yyyy-MM-dd HH:mm')">
                {{ format(selectedDate, props.format) }}
              </time>
            </p>
            <div class="koyomi-picker__body">
              <div class="koyomi-picker__dates">
                <div class="koyomi-picker__dates-header">
                  <div class="koyomi-picker__year-month">
                    <KoyomiSelect
                      :model-value="currentDisplayYear"
                      :options="yearOptions"
                      :teleport-to="props.teleportTo"
                      :window-width="windowSize.windowSize.windowWidth"
                      :window-height="windowSize.windowSize.windowHeight"
                      :window-scroll-top="scrollTop.scrollTop.value"
                      @update:model-value="onSelectYear"
                    />
                    /
                    <KoyomiSelect
                      :model-value="currentDisplayMonth"
                      :options="monthOptions"
                      :teleport-to="props.teleportTo"
                      :window-width="windowSize.windowSize.windowWidth"
                      :window-height="windowSize.windowSize.windowHeight"
                      :window-scroll-top="scrollTop.scrollTop.value"
                      @update:model-value="onSelectMonth"
                    />
                  </div>
                  <ul class="koyomi-picker__controllers">
                    <li class="koyomi-picker__controller-item">
                      <button
                        :disabled="!isPreviousDisplayMonthActive"
                        class="koyomi-picker__controller"
                        @click="onClickMonthControl('previous')"
                      >
                        <KoyomiIcon name="mdiChevronLeft" aria-label="前月" />
                      </button>
                    </li>
                    <li class="koyomi-picker__controller-item">
                      <button class="koyomi-picker__controller" @click="onClickSetToday">今日</button>
                    </li>
                    <li class="koyomi-picker__controller-item">
                      <button
                        :disabled="!isNextDisplayMonthActive"
                        class="koyomi-picker__controller"
                        @click="onClickMonthControl('next')"
                      >
                        <KoyomiIcon name="mdiChevronRight" aria-label="次月" />
                      </button>
                    </li>
                  </ul>
                </div>
                <KoyomiDates
                  :dates="calendarData"
                  :selected-date="
                    selectedDate
                      ? new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate())
                      : null
                  "
                  :day-names="props.dayNames"
                  class="koyomi-picker__calendar"
                  @update:month="onUpdateMonth"
                  @click="onClickDate"
                />
              </div>
              <div v-if="!props.onlyDate" class="koyomi-picker__times">
                <KoyomiTimes
                  :selected-date="selectedDate"
                  :to="props.to"
                  :from="props.from"
                  :disabled-hours="props.disabledHours"
                  :step-minutes="props.stepMinutes"
                  @click:hour="onClickHour"
                  @click:minute="onClickMinute"
                />
              </div>
            </div>
            <div class="koyomi-picker__footer">
              <button class="koyomi-picker__submit" @click="onSubmit">決定</button>
            </div>
          </div>
        </div>
      </transition>

      <div v-if="isVisible" class="koyomi-picker__layer" @click="isVisible = false" />
    </teleport>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount, defineProps, withDefaults, defineEmits } from 'vue'
import { format, startOfMonth, lastDayOfMonth, isBefore, isAfter } from 'date-fns'
import { KoyomiDates, KoyomiIcon, KoyomiSelect, KoyomiTimes } from './components'
import { useCalendar, useYearOptions, useMonthOptions, useWindowSize, useScrollTop } from './composables'

type Props = {
  modelValue: Date | null
  to?: Date
  from?: Date
  defaultDate?: Date
  format?: string
  onlyDate?: boolean
  disabledDates?: number[]
  disabledDays?: number[]
  disabledHours?: number[]
  stepMinutes?: number
  teleportTo?: string
  startDay?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  dayNames?: string[]
}

const BREAKPOINT = 440

const props = withDefaults(defineProps<Props>(), {
  defaultDate: () => new Date(),
  format: 'yyyy/MM/dd HH:mm',
  teleportTo: 'body',
  startDay: 0,
  dayNames: () => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
})

const emits = defineEmits<{
  (e: 'update:modelValue', date: Date): void
}>()

const isVisible = ref(false)
const windowSize = useWindowSize()
const scrollTop = useScrollTop()
const selectedDate = ref<Date | null>(null)

const today = computed(() => new Date())
const {
  currentDisplayDate,
  currentDisplayYear,
  currentDisplayMonth,
  previousDisplayMonth,
  nextDisplayMonth,
  calendarData,
} = useCalendar({
  modelValue: props.modelValue,
  startDay: props.startDay,
  defaultDate: props.defaultDate,
  from: props.from,
  to: props.to,
})

const isPreviousDisplayMonthActive = computed(() => {
  if (!props.from) return true
  const lastDay = lastDayOfMonth(previousDisplayMonth.value)
  return isAfter(lastDay, props.from)
})

const isNextDisplayMonthActive = computed(() => {
  if (!props.to) return true
  const firstDay = startOfMonth(nextDisplayMonth.value)
  return isBefore(firstDay, props.to)
})

const onClickMonthControl = (direction: 'previous' | 'next') => {
  currentDisplayDate.value = direction === 'previous' ? previousDisplayMonth.value : nextDisplayMonth.value
}

const onClickSetToday = () => {
  currentDisplayDate.value = new Date(today.value)
}

const onUpdateMonth = (sum: number) => {
  currentDisplayDate.value = new Date(currentDisplayDate.value.setMonth(currentDisplayDate.value.getMonth() + sum))
}

const onClickDate = (date: Date) => {
  selectedDate.value = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    selectedDate.value?.getHours() || 0,
    selectedDate.value?.getMinutes() || 0
  )
}

const onClickHour = (hour: number) => {
  if (!selectedDate.value) return
  selectedDate.value = new Date(
    selectedDate.value.getFullYear(),
    selectedDate.value.getMonth(),
    selectedDate.value.getDate(),
    hour,
    selectedDate.value.getMinutes()
  )
}

const onClickMinute = (minute: number) => {
  if (!selectedDate.value) return
  selectedDate.value = new Date(
    selectedDate.value.getFullYear(),
    selectedDate.value.getMonth(),
    selectedDate.value.getDate(),
    selectedDate.value.getHours(),
    minute
  )
}

const { yearOptions } = useYearOptions(currentDisplayYear, {
  from: props.from,
  to: props.to,
})

const onSelectYear = (selectedYear: number) => {
  currentDisplayDate.value = new Date(currentDisplayDate.value.setFullYear(selectedYear))
}

const { monthOptions } = useMonthOptions(currentDisplayYear, {
  from: props.from,
  to: props.to,
})

const onSelectMonth = (selectedMonth: number) => {
  currentDisplayDate.value = new Date(currentDisplayDate.value.setMonth(selectedMonth - 1))
}

const onSubmit = () => {
  emits('update:modelValue', selectedDate.value || currentDisplayDate.value)
  isVisible.value = false
}

const activatorRef = ref<HTMLDivElement | null>(null)
const contentRects = reactive<{ top: number; height: number }>({ top: 0, height: 0 })

const setContentRects = () => {
  if (!activatorRef.value) return
  const { top, height } = activatorRef.value.getClientRects()[0]
  contentRects.top = top
  contentRects.height = height
}

watch(windowSize.windowSize, () => {
  setContentRects()
})

const contentStyle = computed<{ [key: string]: string }>(() => {
  const styles: { [key: string]: string } = {}
  if (windowSize.windowSize.windowWidth <= BREAKPOINT) return {}

  if (windowSize.windowSize.windowHeight - contentRects.top + contentRects.height > 200) {
    styles.top = `${contentRects.top + contentRects.height + 8}px`
  }
  return styles
})

const innerStyle = computed<{ [key: string]: string }>(() => {
  const styles: { [key: string]: string } = {}
  if (windowSize.windowSize.windowWidth <= BREAKPOINT) return {}
  if (windowSize.windowSize.windowHeight - contentRects.top + contentRects.height > 200) {
    styles['max-height'] = `${windowSize.windowSize.windowHeight - contentRects.top - contentRects.height - 20}px`
  }
  return styles
})

const formattedValue = computed(() => {
  return props.modelValue ? format(props.modelValue, props.format) : ''
})

const onActivator = () => {
  isVisible.value = !isVisible.value
}

onMounted(() => {
  windowSize.initialize()
  scrollTop.initialize()
  setContentRects()

  if (props.modelValue) {
    selectedDate.value = props.modelValue
  }
})

onBeforeUnmount(() => {
  windowSize.destroy()
  scrollTop.destroy()
})
</script>

<script lang="ts">
export default {
  name: 'VueKoyomiPicker',
}
</script>

<style lang="scss" scoped>
$bp: 440px;

.koyomi-picker__activator {
  width: fit-content;
}

.koyomi-picker__content {
  position: fixed;
  z-index: 11900;
  overflow: hidden;
  box-shadow: 0 12px 24px 0 rgba(0, 0, 0, 0.16);
  box-sizing: border-box;
  border-radius: 8px;
  max-width: fit-content;
  background: var(--vue-koyomi-white);

  @media screen and (max-width: $bp) {
    top: 0;
    left: 0;
    border-radius: 0;
    width: 100%;
    height: 100%;
    max-width: none;
  }
}

.koyomi-picker__inner {
  overflow-y: auto;

  @media screen and (max-width: $bp) {
    overflow-y: visible;
    display: flex;
    flex-direction: column;
    height: 100vh;
  }
}

.koyomi-picker__selected-date {
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0 16px;
  height: 60px;
  background: var(--vue-koyomi-primary);
  font-family: Inter, sans-serif;
  font-size: 15px;
  font-weight: bold;
  line-height: 1.4;
  color: var(--vue-koyomi-white);

  @media screen and (max-width: $bp) {
    flex-shrink: 0;
  }
}

.koyomi-picker__body {
  display: flex;

  @media screen and (max-width: $bp) {
    overflow-y: auto;
    display: block;
  }
}

.koyomi-picker__dates {
  padding: 8px 16px 12px;
}

.koyomi-picker__dates-header {
  @media screen and (max-width: $bp) {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.koyomi-picker__year-month {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0 4px;
}

.koyomi-picker__controllers {
  position: relative;
  right: -10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 4px 0 12px;
  padding: 0;
  line-height: 1;

  @media screen and (max-width: $bp) {
    margin: 0;
  }
}

.koyomi-picker__controller-item {
  list-style-type: none;
}

.koyomi-picker__controller {
  box-shadow: none;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  background: transparent;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.3s ease, color 0.3s ease;

  &:hover,
  &:focus-visible {
    background: var(--vue-koyomi-primary-light);
  }
}

.koyomi-picker__calendar {
  @media screen and (max-width: $bp) {
    margin-top: 8px;
  }
}

.koyomi-picker__times {
  @media screen and (max-width: $bp) {
    border-top: 1px solid var(--vue-koyomi-gray-border);
  }
}

.koyomi-picker__footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 8px 16px;
  background: var(--vue-koyomi-gray-light);

  @media screen and (max-width: $bp) {
    flex-shrink: 0;
  }
}

.koyomi-picker__submit {
  box-shadow: none;
  border-radius: 4px;
  border: none;
  padding: 4px 16px;
  background: var(--vue-koyomi-primary);
  font-size: 14px;
  color: var(--vue-koyomi-white);
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover,
  &:focus-visible {
    background: var(--vue-koyomi-primary-dark);
  }
}

.koyomi-picker__layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 11899;
}

.koyomi-picker-enter-active,
.koyomi-picker-leave-active {
  transition: opacity 0.3s ease;
}

.koyomi-picker-enter-from,
.koyomi-picker-leave-to {
  opacity: 0;
}
</style>
