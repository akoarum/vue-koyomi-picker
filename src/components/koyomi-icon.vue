<template>
  <svg viewBox="0 0 24 24" class="koyomi-icon">
    <path :d="iconPath" fill="currentColor" />
  </svg>
</template>

<script lang="ts" setup>
import { computed, withDefaults } from 'vue'
import * as mdiIcon from '@mdi/js'

export type Props = {
  name: string
  size?: string
}

const props = withDefaults(defineProps<Props>(), { size: '24px' })

const iconPath = computed<string>(() => mdiIcon[props.name])
</script>

<script lang="ts">
export default {
  name: 'KoyomiIcon',
}
</script>

<style lang="scss" scoped>
.koyomi-icon {
  vertical-align: top;
}
</style>

<style scoped>
.koyomi-icon {
  width: v-bind(props.size);
  height: v-bind(props.size);
}
</style>
