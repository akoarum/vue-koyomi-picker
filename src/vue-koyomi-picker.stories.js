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
        :to="args.to"
        :from="args.from"
        :default-date="args.defaultDate"
        :format="args.format"
        :only-date="args.onlyDate"
        :disabled-dates="args.disabledDates"
        :disabled-days="args.disabledDays"
        :disabled-hours="args.disabledHours"
        :step-minutes="args.stepMinutes"
        :start-day="args.startDay"
        :day-names="args.dayNames"
        :teleport-to="args.teleportTo"
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
  to: new Date('2022/10/15 18:45'),
  from: new Date('2020/04/01 09:30'),
  defaultDate: new Date(),
  format: 'yyyy/MM/dd HH:mm',
  onlyDate: false,
  disabledDates: [],
  disabledDays: [],
  disabledHours: [],
  stepMinutes: 1,
  startDay: 0,
  dayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  teleportTo: 'body',
}
