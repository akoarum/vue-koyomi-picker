import VueKoyomiPicker from './vue-koyomi-picker.vue'

export default {
  title: 'VueKoyomiPicker',
  component: VueKoyomiPicker,
  argTypes: {
    onlyDate: {
      control: { type: 'boolean' },
    },
  },
}

const Template = (args) => ({
  components: { VueKoyomiPicker },
  data() {
    return {
      value: new Date('2022/08/25'),
    }
  },
  setup() {
    return {
      args,
    }
  },
  template: `
    <div>
      <p>state: {{ value }}</p>
      <VueKoyomiPicker
        v-model="value"
        :from="args.from"
        :to="args.to"
        :only-date="args.onlyDate"
        :start-day="args.startDay"
        :day-names="args.dayNames"
        :disabled-hours="args.disabledHours"
        :step-minutes="args.stepMinutes"
      >
        <template #activator="{ on, formattedValue }">
          <input :value="formattedValue" type="text" @focus="on" />
        </template>
      </VueKoyomiPicker>
    </div>
  `,
})

export const Default = Template.bind({})
Default.args = {
  from: new Date('2020/04/01 09:30'),
  to: new Date('2022/10/15 18:45'),
  startDay: 0,
  onlyDate: false,
  dayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  disabledHours: [],
  stepMinutes: 1,
}
