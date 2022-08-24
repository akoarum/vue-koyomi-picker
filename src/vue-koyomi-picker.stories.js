import VueKoyomiPicker from './vue-koyomi-picker.vue'

export default {
  title: 'VueKoyomiPicker',
  component: VueKoyomiPicker,
}

const Template = (args) => ({
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
      <p>state: {{ value }}</p>
      <VueKoyomiPicker v-model="value" :from="args.from" :to="args.to" :start-day="args.startDay" :day-names="args.dayNames" />
    </div>
  `,
})

export const Default = Template.bind({})
Default.args = {
  from: new Date('2020-04-01'),
  to: new Date('2022-10-15'),
  startDay: 0,
  dayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
}
