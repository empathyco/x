<template>
  <Wrapper feature="Input" :rows="rows">
    <template #default>
      <input class="xds:input" placeholder="Input" />
    </template>
    <template #size>
      <input class="xds:input xds:input-sm" placeholder="sm" />
      <input class="xds:input xds:input-md" placeholder="md" />
      <input class="xds:input xds:input-lg" placeholder="lg" />
    </template>
    <template #color>
      <input
        v-for="(value, key) in colors"
        :key="`color-${key}`"
        class="xds:input"
        :class="value"
        :placeholder="`${key} Input`"
      />
    </template>
    <template #line>
      <input class="xds:input xds:input-line" placeholder="Line" />
    </template>
    <template #line-size>
      <input class="xds:input xds:input-line xds:input-sm" placeholder="line sm" />
      <input class="xds:input xds:input-line xds:input-md" placeholder="line md" />
      <input class="xds:input xds:input-line xds:input-lg" placeholder="line lg" />
    </template>
    <template #line-color>
      <input
        v-for="(value, key) in colors"
        :key="`line-color-${key}`"
        class="xds:input xds:input-line"
        :class="value"
        :placeholder="`line ${key}`"
      />
    </template>
    <template #disabled>
      <input class="xds:input" disabled placeholder="input" />
      <input class="xds:input xds:input-line" disabled placeholder="line" />
    </template>
    <template #combinations>
      <input class="xds:input xds:input-lead xds:input-sm" placeholder="lead sm" />
      <input
        class="xds:input xds:input-auxiliary xds:input-line xds:input-sm"
        placeholder="auxiliary line sm"
      />
      <input class="xds:input xds:input-accent xds:input-lg" placeholder="accent lg" />
      <input
        class="xds:input xds:input-warning xds:input-line xds:input-lg"
        placeholder="warning line lg"
      />
    </template>
  </Wrapper>
</template>

<script setup lang="ts">
import Wrapper from './wrapper.vue'

const rows = [
  'default',
  'size',
  'color',
  'line',
  'line-size',
  'line-color',
  'disabled',
  'combinations',
]
const colors = {
  neutral: 'xds:input-neutral',
  lead: 'xds:input-lead',
  auxiliary: 'xds:input-auxiliary',
  accent: 'xds:input-accent',
  highlight: 'xds:input-highlight',
  success: 'xds:input-success',
  warning: 'xds:input-warning',
  error: 'xds:input-error',
}
</script>
