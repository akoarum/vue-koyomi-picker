import VueKoyomiPicker from './vue-koyomi-picker.vue'

export default {
  title: 'VueKoyomiPicker',
  component: VueKoyomiPicker,
  argTypes: {
    to: {
      control: { type: 'date' },
      description:
        'Specifies the maximum date and time that can be selected; the picker will not be able to select any later date and time.',
    },
    from: {
      control: { type: 'date' },
      description:
        'Specifies the minimum date and time that can be selected; the picker will not be able to select earlier dates and times.',
    },
    defaultDate: {
      control: { type: 'date' },
      description: 'Specify the date and time that is selected when the picker is opened.',
    },
    format: {
      control: { type: 'text' },
      description: 'Specifies the format of the string.<br />See `format` in date-fns documentation.',
    },
    onlyDate: {
      control: { type: 'boolean' },
      description: 'Hide Time Picker and enabled Date Picker only.',
    },
    disabledDates: {
      control: { type: 'object' },
      description: 'Specify dates to disable.',
    },
    disabledDays: {
      control: { type: 'object' },
      description: 'Specify days of the week to disable.',
    },
    disabledHours: {
      control: { type: 'object' },
      description: 'Specify hours to disable.',
    },
    stepMinutes: {
      control: { type: 'number', min: 1, max: 59 },
      description: 'Specify the number of minute steps.',
    },
    firstDay: {
      control: { type: 'select' },
      options: [0, 1, 2, 3, 4, 5, 6],
      description:
        'Specify the first day of the week.<br />It is not linked to dayNames and needs to be reordered accordingly.',
    },
    dayNames: {
      control: { type: 'object' },
      description:
        'Specify the name of the day of the week to be displayed in the calendar.<br />It is not linked to firstDay and needs to be reordered accordingly.',
    },
    phrases: {
      control: { type: 'object' },
      description: 'Specify phrases to be used for buttons, etc.',
    },
    teleportTo: {
      control: { type: 'text' },
      description: 'Specifies the teleport destination.<br />See Vue3 documentation for `teleport` .',
    },
  },
}

const BasicTemplate = (args) => ({
  components: { VueKoyomiPicker },
  data() {
    return {
      value: null,
    }
  },
  setup() {
    return {
      args,
    }
  },
  template: `
    <div>
      <VueKoyomiPicker v-model="value">
        <template #activator="{ on, formattedValue }">
          <input :value="formattedValue" type="text" @focus="on" />
        </template>
      </VueKoyomiPicker>
    </div>
  `,
})

export const Basic = BasicTemplate.bind({})

const RangeTemplate = (args) => ({
  components: { VueKoyomiPicker },
  data() {
    return {
      value: null,
    }
  },
  setup() {
    return {
      args,
    }
  },
  template: `
    <div>
      <VueKoyomiPicker
        v-model="value"
        :to="new Date(args.to)"
        :from="new Date(args.from)"
      >
        <template #activator="{ on, formattedValue }">
          <input :value="formattedValue" type="text" @focus="on" />
        </template>
      </VueKoyomiPicker>
    </div>
  `,
})

export const Range = RangeTemplate.bind({})
Range.args = {
  to: new Date('2023/04/30 11:00'),
  from: new Date('2021/10/01 19:30'),
}

const OnlyDateTemplate = (args) => ({
  components: { VueKoyomiPicker },
  data() {
    return {
      value: null,
    }
  },
  setup() {
    return {
      args,
    }
  },
  template: `
    <div>
      <VueKoyomiPicker v-model="value" :only-date="args.onlyDate">
        <template #activator="{ on, formattedValue }">
          <input :value="formattedValue" type="text" @focus="on" />
        </template>
      </VueKoyomiPicker>
    </div>
  `,
})

export const OnlyDate = OnlyDateTemplate.bind({})
OnlyDate.args = {
  onlyDate: true,
}

const DisabledDatesTemplate = (args) => ({
  components: { VueKoyomiPicker },
  data() {
    return {
      value: null,
    }
  },
  setup() {
    return {
      args,
    }
  },
  template: `
    <div>
      <VueKoyomiPicker v-model="value" :default-date="args.defaultDate" :disabled-dates="args.disabledDates">
        <template #activator="{ on, formattedValue }">
          <input :value="formattedValue" type="text" @focus="on" />
        </template>
      </VueKoyomiPicker>
    </div>
  `,
})

export const DisabledDates = DisabledDatesTemplate.bind({})
DisabledDates.args = {
  defaultDate: new Date('2022/10/01'),
  disabledDates: [new Date('2022/10/05'), new Date('2022/10/27')],
}

const DisabledDaysTemplate = (args) => ({
  components: { VueKoyomiPicker },
  data() {
    return {
      value: null,
    }
  },
  setup() {
    return {
      args,
    }
  },
  template: `
    <div>
      <VueKoyomiPicker v-model="value" :disabled-days="args.disabledDays">
        <template #activator="{ on, formattedValue }">
          <input :value="formattedValue" type="text" @focus="on" />
        </template>
      </VueKoyomiPicker>
    </div>
  `,
})

export const DisabledDays = DisabledDaysTemplate.bind({})
DisabledDays.args = {
  disabledDays: [1, 4],
}

const DisabledHoursTemplate = (args) => ({
  components: { VueKoyomiPicker },
  data() {
    return {
      value: null,
    }
  },
  setup() {
    return {
      args,
    }
  },
  template: `
    <div>
      <VueKoyomiPicker v-model="value" :disabled-hours="args.disabledHours">
        <template #activator="{ on, formattedValue }">
          <input :value="formattedValue" type="text" @focus="on" />
        </template>
      </VueKoyomiPicker>
    </div>
  `,
})

export const DisabledHours = DisabledHoursTemplate.bind({})
DisabledHours.args = {
  disabledHours: [0, 1, 2, 10, 22],
}

const StepMinutesTemplate = (args) => ({
  components: { VueKoyomiPicker },
  data() {
    return {
      value: null,
    }
  },
  setup() {
    return {
      args,
    }
  },
  template: `
    <div>
      <VueKoyomiPicker v-model="value" :step-minutes="args.stepMinutes">
        <template #activator="{ on, formattedValue }">
          <input :value="formattedValue" type="text" @focus="on" />
        </template>
      </VueKoyomiPicker>
    </div>
  `,
})

export const StepMinutes = StepMinutesTemplate.bind({})
StepMinutes.args = {
  stepMinutes: 15,
}

const CustomDaysTemplate = (args) => ({
  components: { VueKoyomiPicker },
  data() {
    return {
      value: null,
    }
  },
  setup() {
    return {
      args,
    }
  },
  template: `
    <div>
      <VueKoyomiPicker v-model="value" :first-day="args.firstDay" :day-names="args.dayNames">
        <template #activator="{ on, formattedValue }">
          <input :value="formattedValue" type="text" @focus="on" />
        </template>
      </VueKoyomiPicker>
    </div>
  `,
})

export const CustomDays = CustomDaysTemplate.bind({})
CustomDays.args = {
  firstDay: 1,
  dayNames: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
}

const CustomPhrasesTemplate = (args) => ({
  components: { VueKoyomiPicker },
  data() {
    return {
      value: null,
    }
  },
  setup() {
    return {
      args,
    }
  },
  template: `
    <div>
      <VueKoyomiPicker v-model="value" :day-names="args.dayNames" :phrases="args.phrases">
        <template #activator="{ on, formattedValue }">
          <input :value="formattedValue" type="text" @focus="on" />
        </template>
      </VueKoyomiPicker>
    </div>
  `,
})

export const CustomPhrases = CustomPhrasesTemplate.bind({})
CustomPhrases.args = {
  dayNames: ['日', '月', '火', '水', '木', '金', '土'],
  phrases: {
    ok: '決定',
    today: '今日',
    lastMonth: '前月',
    followingMonth: '次月',
  },
}
