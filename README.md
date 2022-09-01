# Vue Koyomi Picker

[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE)

Simply datetime picker for Vue3.  
Supported date mode and datetime mode.

> `Koyomi` is Japanese for calendar.

## Demo

Please see the Storybook below.

https://dark-cloud-7478.spearly.app/

## Installation

### Install

```
// npm
$ npm install --save vue-koyomi-picker

// yarn
$ yarn add vue-koyomi-picker
```

### Register

```js
import { createApp } from 'vue'
import { VueKoyomiPicker } from 'vue-koyomi-picker'
import 'vue-koyomi-picker/dist/style.css'

const app = createApp()

app.component('datetime-picker', VueKoyomiPicker)
```

## Usage

### Minimal

```html
<datetime-picker v-model="date">
  <template #activator="{ on, formattedValue }">
    <input :value="formattedValue" type="text" @focus="on" />
  </template>
</datetime-picker>
```

## Setup

### Props
| Name | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| v-model (modelValue) *Required | `Date | null` | - | Date time. |
| to | `Date` | - | Specifies the maximum date and time that can be selected; the picker will not be able to select any later date and time. |
| from | `Date` | - | Specifies the minimum date and time that can be selected; the picker will not be able to select earlier dates and times. |
| defaultDate | `Date` | `new Date()` | Specify the date and time that is selected when the picker is opened. |
| format | `string` | `yyyy/MM/dd HH:mm` | Specifies the format of the string.<br />See `format` in date-fns documentation. |
| onlyDate | `boolean` | - | Hide Time Picker and enabled Date Picker only. |
| disabledDates | `Date[]` | - | Specify dates to disable. |
| disabledDays | `(0 | 1 | 2 | 3 | 4 | 5 | 6)[]` | - | Specify days of the week to disable. |
| disabledHours | `number[]` (0-23) | - | Specify hours to disable. |
| stepMinutes | `number` (0-59) | - | Specify the number of minute steps. |
| firstDay | `0 | 1 | 2 | 3 | 4 | 5 | 6` | 0 | Specify the first day of the week.<br />It is not linked to dayNames and needs to be reordered accordingly. |
| dayNames | `string[]` | `['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']` | Specify the name of the day of the week to be displayed in the calendar.<br />It is not linked to firstDay and needs to be reordered accordingly. |
| phrases | `Object` | `{ today: 'Today', lastMonth: 'Last month', followingMonth: 'Following month', ok: 'OK' }` | Specify phrases to be used for buttons, etc. |
| teleportTo | `string` | `body` | Specifies the teleport destination.<br />See Vue3 documentation for `teleport` . |

### Slots

#### `activator`
Specifies the element that activates datetime picker or displays its value.
`on` and `formattedValue` are passed to `activator`.
`on` allows datetime picker to be displayed.
`formattedValue` is the formatted value of `v-model(modelValue)`.

Example of using a button:

```html
<datetime-picker v-model="date">
  <template #activator="{ on, formattedValue }">
    <button type="button" @click="on">
      {{ formattedValue }}
    </button>
  </template>
</datetime-picker>
```

### Styles

The colors are specified in CSS Variables and can be changed by overriding the following with your CSS.

| Variable Name | Default |
| :--- | :--- |
| `--vue-koyomi-primary` | `#2a85ff` |
| `--vue-koyomi-primary-dark` | `#1369db` |
| `--vue-koyomi-primary-light` | `#e4effc` |
| `--vue-koyomi-black` | `#272526` |
| `--vue-koyomi-gray` | `#a6a9a7` |
| `--vue-koyomi-gray-border` | `#e2e5f1` |
| `--vue-koyomi-gray-light` | `#f6f7f9` |
| `--vue-koyomi-white` | `#fff` |


## Development

### Starting Storybook locally

```
$ npm run storybook
```

### Test

```
$ npm run test
```

### Build

```
$ npm run build
```
