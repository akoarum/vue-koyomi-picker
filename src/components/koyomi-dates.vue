<template>
  <table class="koyomi-dates">
    <thead>
      <tr>
        <th v-for="day in props.dayNames" :key="day" class="koyomi-dates__day">{{ day }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(week, i) in props.dates" :key="i" class="koyomi-dates__weekly">
        <td v-for="(day, j) in week" :key="day ? day.date.getDate() : j" class="koyomi-dates__daily">
          <button
            ref="dateRef"
            :data-time="day.date.getTime()"
            :disabled="!day.isActive"
            :tabindex="getTabIndex(day.date)"
            :class="getDateButtonClasses(day.date)"
            type="button"
            class="koyomi-dates__button"
            @keydown="onKeydownOnDate"
            @focus="onFocus(day.date)"
            @click="onClick(day.date)"
          >
            <time :datetime="format(day.date, 'yyyy-MM-dd')" class="koyomi-dates__date-time">
              {{ day.date.getDate() }}
            </time>
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts" setup>
import { ref, defineProps, defineEmits, computed, watch, onMounted, nextTick } from 'vue'
import { format, startOfMonth, lastDayOfMonth } from 'date-fns'
import type { DateOption } from '../composables'

export type Props = {
  dates: DateOption[][]
  selectedDate: Date | null
  dayNames: string[]
}

export type Emits = {
  (e: 'click', date: Date): void
  (e: 'update:month', sum: number): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const today = computed(() => {
  const date = new Date()
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
})

const getDateButtonClasses = (date: Date): string[] => {
  const classes: string[] = []
  if (today.value.getTime() === date.getTime()) classes.push('is-today')
  if (props.selectedDate && props.selectedDate.getTime() === date.getTime()) classes.push('is-selected')
  return classes
}

const getTabIndex = (date: Date): 0 | -1 => {
  if (props.selectedDate && props.selectedDate.getTime() === date.getTime()) return 0
  return -1
}

const onFocus = (date: Date) => {
  emits('click', date)
}

const onClick = (date: Date) => {
  emits('click', date)
  setFocusIndex()
}

const dateRef = ref<HTMLButtonElement[]>()
const focusIndex = ref<number[]>([0, 0])

const dateRefMappings = computed(() => {
  if (!props.dates.length) return []
  if (!dateRef.value) return []

  const refs = [...dateRef.value]
  const calendar: HTMLButtonElement[][] = []
  let weekly: HTMLButtonElement[] = []

  refs
    .sort((a, b) => (Number(a.getAttribute('data-time')!) < Number(b.getAttribute('data-time')!) ? -1 : 1))
    .forEach((date, index) => {
      weekly.push(date)
      if (index % 7 === 6) {
        calendar.push(weekly)
        weekly = []
      }
    })

  return calendar
})

watch(focusIndex, ([weekly, day]) => {
  dateRefMappings.value[weekly][day].focus()
})

const setFocusIndex = () => {
  const targetDate = props.selectedDate || today.value
  const indexes = props.dates
    .map((weekly, index) => {
      const dateIndex = weekly.findIndex((date) => {
        return (
          date.date.getTime() ===
          new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()).getTime()
        )
      })
      if (dateIndex < 0) return [-1, -1]
      return [index, dateIndex]
    })
    .find((weekly) => weekly[0] > -1 && weekly[1] > -1)

  if (!indexes) return
  focusIndex.value = indexes
}

const onKeydownOnDate = (event: KeyboardEvent) => {
  const updateFocusIndex = (sumWeekly: number, sumDay: number) => {
    const [beforeWeekly, beforeDay] = focusIndex.value
    if (sumDay < 0 && beforeDay === 0) {
      if (beforeWeekly - 1 < 0) {
        emits('update:month', -1)
        nextTick(() => {
          focusIndex.value = [props.dates.length - 1, 6]
        })
      } else {
        focusIndex.value = [beforeWeekly - 1, 6]
      }
    } else if (sumDay > 0 && beforeDay === 6) {
      if (beforeWeekly + 1 > props.dates.length - 1) {
        emits('update:month', 1)
        nextTick(() => {
          focusIndex.value = [0, 0]
        })
      } else {
        focusIndex.value = [beforeWeekly + 1, 0]
      }
    } else if (sumWeekly < 0 && beforeWeekly === 0) {
      emits('update:month', -1)
      nextTick(() => {
        focusIndex.value = [props.dates.length - 1, beforeDay]
      })
    } else if (sumWeekly > 0 && beforeWeekly === props.dates.length - 1) {
      emits('update:month', 1)
      nextTick(() => {
        focusIndex.value = [0, beforeDay]
      })
    } else {
      focusIndex.value = [beforeWeekly + sumWeekly, beforeDay + sumDay]
    }
  }

  switch (event.key) {
    case 'ArrowUp':
      updateFocusIndex(-1, 0)
      event.preventDefault()
      break
    case 'ArrowDown':
      updateFocusIndex(1, 0)
      event.preventDefault()
      break
    case 'ArrowLeft':
      updateFocusIndex(0, -1)
      event.preventDefault()
      break
    case 'ArrowRight':
      updateFocusIndex(0, 1)
      event.preventDefault()
      break
    case 'Home':
      const firstDay = startOfMonth(props.selectedDate || today.value)
      updateFocusIndex(0, firstDay.getDay())
      event.preventDefault()
      break
    case 'End':
      const lastDay = lastDayOfMonth(props.selectedDate || today.value)
      updateFocusIndex(props.dates.length - 1, lastDay.getDay())
      event.preventDefault()
      break
  }
}

onMounted(() => {
  setFocusIndex()
})
</script>

<script lang="ts">
export default {
  name: 'KoyomiDates',
}
</script>

<style lang="scss" scoped>
.koyomi-dates {
  table-layout: fixed;
  border-collapse: collapse;
  font-family: 'Inter', sans-serif;
}

.koyomi-dates__day {
  font-size: 12px;
  color: var(--vue-koyomi-gray);
}

.koyomi-dates__daily {
  padding: 1px;
}

.koyomi-dates__button {
  display: block;
  border-radius: 2px;
  border: none;
  box-shadow: none;
  box-sizing: border-box;
  padding: 0;
  width: 32px;
  height: 32px;
  background: transparent;
  font-weight: 700;
  font-size: 13px;
  color: var(--vue-koyomi-black);
  cursor: pointer;
  transition: background 0.3s ease, color 0.3s ease;

  &.is-today {
    color: var(--vue-koyomi-primary);
  }

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
}

.koyomi-dates__date-time {
  font-family: 'Inter', sans-serif;
}
</style>

<style src="inter-ui/inter.css"></style>
