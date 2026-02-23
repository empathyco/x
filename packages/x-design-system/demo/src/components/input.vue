<template>
  <Wrapper feature="Input" :rows="rows">
    <template #default>
      <input class="xds:input" placeholder="Input" />
    </template>
    <template #size>
      <div class="xds:flex xds:flex-row xds:flex-wrap xds:gap-8 xds:items-center">
        <input class="xds:input xds:input-sm" placeholder="sm" />
        <input class="xds:input xds:input-md" placeholder="md" />
        <input class="xds:input xds:input-lg" placeholder="lg" />
      </div>
    </template>
    <template #color>
      <input class="xds:input" placeholder="Input" />
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
      <div class="xds:flex xds:flex-row xds:flex-wrap xds:gap-8 xds:items-center">
        <input class="xds:input xds:input-line xds:input-sm" placeholder="line sm" />
        <input class="xds:input xds:input-line xds:input-md" placeholder="line md" />
        <input class="xds:input xds:input-line xds:input-lg" placeholder="line lg" />
      </div>
    </template>
    <template #line-color>
      <div class="xds:flex xds:flex-row xds:flex-wrap xds:gap-8 xds:items-center">
        <input class="xds:input xds:input-line" placeholder="Line default" />
        <input
          v-for="(value, key) in colors"
          :key="`line-color-${key}`"
          class="xds:input xds:input-line"
          :class="value"
          :placeholder="`line ${key}`"
        />
      </div>
    </template>
    <template #disabled>
      <div class="xds:flex xds:flex-row xds:flex-wrap xds:gap-8 xds:items-center">
        <input class="xds:input" disabled placeholder="input" />
        <input class="xds:input xds:input-line" disabled placeholder="line" />
      </div>
    </template>
    <template #combinations>
      <div class="xds:flex xds:flex-row xds:flex-wrap xds:gap-8 xds:items-center">
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
      </div>
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
