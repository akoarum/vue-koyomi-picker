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
            :data-time="day.date.getTime()"
            :disabled="!day.isActive"
            :class="getDateButtonClasses(day.date)"
            type="button"
            class="koyomi-dates__button"
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
import { computed } from 'vue'
import { format } from 'date-fns'
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

const onClick = (date: Date) => {
  emits('click', date)
}
</script>

<script lang="ts">
export default {
  name: 'KoyomiDates',
}
</script>

<style lang="scss" scoped>
$bp: 440px;

.koyomi-dates {
  table-layout: fixed;
  border-collapse: collapse;
  font-family: 'Inter', sans-serif;

  @media screen and (max-width: 440px) {
    width: 100%;
  }
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
  margin: 0 auto;
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
