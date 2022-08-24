<template>
  <div class="koyomi-picker">
    <p class="koyomi-picker__selected-date">{{ selectedDate && format(selectedDate, props.format) }}</p>
    <div class="koyomi-picker__body">
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
            前月
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
            次月
          </button>
        </li>
      </ul>
      <KoyomiDates
        :dates="calendarData"
        :selected-date="selectedDate"
        :day-names="props.dayNames"
        @update:month="onUpdateMonth"
        @click="onClickDate"
      />
    </div>
    <div class="koyomi-picker__footer">
      <button class="koyomi-picker__submit" @click="onSubmit">決定</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onBeforeUnmount, defineProps, withDefaults, defineEmits } from 'vue'
import { format, startOfMonth, lastDayOfMonth, isBefore, isAfter } from 'date-fns'
import { KoyomiDates, KoyomiSelect } from './components'
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
  teleportTo?: string
  startDay?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  dayNames?: string[]
}
const props = withDefaults(defineProps<Props>(), {
  defaultDate: () => new Date(),
  format: 'yyyy/MM/dd hh:mm',
  teleportTo: 'body',
  startDay: 0,
  dayNames: () => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
})

const emits = defineEmits<{
  (e: 'update:modelValue', date: Date): void
}>()

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
  selectedDate.value = date
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
}

onMounted(() => {
  windowSize.initialize()
  scrollTop.initialize()
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
.koyomi-picker {
  overflow: hidden;
  box-sizing: border-box;
  border-radius: 8px;
  box-shadow: 0 12px 24px 0 rgba(0, 0, 0, 0.16);
  max-width: 268px;
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
}

.koyomi-picker__body {
  padding: 8px 16px 12px;
}

.koyomi-picker__year-month {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0 4px;
}

.koyomi-picker__controllers {
  display: flex;
  justify-content: space-between;
  margin: 4px 0 12px;
  padding: 0;
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
  cursor: pointer;
  transition: background 0.3s ease, color 0.3s ease;

  &:hover,
  &:focus-visible {
    background: var(--vue-koyomi-primary-light);
  }
}

.koyomi-picker__footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 8px 16px;
  background: var(--vue-koyomi-gray-light);
}

.koyomi-picker__submit {
  box-shadow: none;
  border-radius: 4px;
  border: none;
  padding: 4px 16px;
  background: var(--vue-koyomi-primary);
  color: var(--vue-koyomi-white);
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover,
  &:focus-visible {
    background: var(--vue-koyomi-primary-dark);
  }
}
</style>
