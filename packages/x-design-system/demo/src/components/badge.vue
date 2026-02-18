<template>
  <Wrapper feature="Badge" :rows="rows">
    <template #default>
      <span class="xds:badge">badge</span>
    </template>
    <template #size>
      <span class="xds:badge xds:badge-sm">sm badge</span>
      <span class="xds:badge xds:badge-md">md badge</span>
    </template>
    <template #circle>
      <span class="xds:badge xds:badge-circle xds:badge-sm">1</span>
      <span class="xds:badge xds:badge-circle xds:badge-md">1</span>
    </template>
    <template #color>
      <span v-for="(value, key) in colors" :key="key" class="xds:badge" :class="value">
        {{ key }} badge
      </span>
    </template>
    <template #light>
      <span class="xds:badge xds:badge-light">light badge</span>
      <span
        v-for="(value, key) in colors"
        :key="key"
        class="xds:badge xds:badge-light"
        :class="[value]"
      >
        light {{ key }} badge
      </span>
    </template>
    <template #outlined>
      <span class="xds:badge xds:badge-outlined">outlined badge</span>
      <span
        v-for="(value, key) in colors"
        :key="key"
        class="xds:badge xds:badge-outlined"
        :class="[value]"
      >
        outlined {{ key }} badge
      </span>
    </template>
    <template #bright>
      <span class="xds:badge xds:badge-bright">bright badge</span>
      <span
        v-for="(value, key) in colors"
        :key="key"
        class="xds:badge xds:badge-bright"
        :class="[value]"
      >
        bright {{ key }} badge
      </span>
    </template>
  </Wrapper>
</template>

<script setup lang="ts">
import Wrapper from './wrapper.vue'

const rows = [
  'default',
  'size',
  'circle',
  'color',
  'light',
  'outlined',
  'bright',
  'attachTo',
  'withIcon',
  'combinations',
]
const colors = {
  neutral: 'xds:badge-neutral',
  lead: 'xds:badge-lead',
  auxiliary: 'xds:badge-auxiliary',
  accent: 'xds:badge-accent',
  highlight: 'xds:badge-highlight',
  success: 'xds:badge-success',
  warning: 'xds:badge-warning',
  error: 'xds:badge-error',
}
</script>
