<template>
  <Wrapper feature="Suggestion" :rows="rows">
    <template #default>
      <button class="xds:suggestion xds:w-30">
        <CuratedIcon class="xds:icon" />
        very long default suggestion to test line wrap alignment
      </button>
    </template>
    <template #color>
      <button v-for="(value, key) in colors" :key="key" class="xds:suggestion" :class="value">
        <CuratedIcon class="xds:icon" />
        {{ cleanedValue(value) }} suggestion
      </button>
    </template>
    <template #size>
      <button
        v-for="size in ['xds:suggestion-sm', 'xds:suggestion-md', 'xds:suggestion-lg']"
        :key="size"
        class="xds:suggestion"
        :class="size"
      >
        <CuratedIcon class="xds:icon" />
        {{ cleanedValue(size) }} suggestion
      </button>
    </template>
    <template #outlined>
      <button
        v-for="(value, key) in colors"
        :key="key"
        class="xds:suggestion xds:suggestion-outlined"
        :class="value"
      >
        <CuratedIcon class="xds:icon" />
        outlined {{ cleanedValue(value) }} suggestion
      </button>
    </template>
    <template #outlined-size>
      <button
        v-for="size in ['xds:suggestion-sm', 'xds:suggestion-md', 'xds:suggestion-lg']"
        :key="size"
        class="xds:suggestion xds:suggestion-outlined"
        :class="size"
      >
        <CuratedIcon class="xds:icon" />
        outlined {{ cleanedValue(size) }} suggestion
      </button>
    </template>
    <template #ghost>
      <button
        v-for="(value, key) in colors"
        :key="key"
        class="xds:suggestion xds:suggestion-ghost"
        :class="value"
      >
        <CuratedIcon class="xds:icon" />
        ghost {{ cleanedValue(value) }} suggestion
      </button>
    </template>
    <template #ghost-size>
      <button
        v-for="size in ['xds:suggestion-sm', 'xds:suggestion-md', 'xds:suggestion-lg']"
        :key="size"
        class="xds:suggestion xds:suggestion-ghost"
        :class="size"
      >
        <CuratedIcon class="xds:icon" />
        ghost {{ cleanedValue(size) }} suggestion
      </button>
    </template>
    <template #combinations>
      <button class="xds:suggestion xds:suggestion-md xds:suggestion-success">
        <CuratedIcon class="xds:icon" />
        success md suggestion
      </button>
      <button class="xds:suggestion xds:suggestion-md xds:suggestion-auxiliary">
        <CuratedIcon class="xds:icon" />
        auxiliary md suggestion
      </button>
      <button class="xds:suggestion xds:suggestion-lg xds:suggestion-error">
        <CuratedIcon class="xds:icon" />
        error lg suggestion
      </button>
    </template>
  </Wrapper>
</template>

<script setup lang="ts">
import CuratedIcon from './icons/curated.svg'
import Wrapper from './wrapper.vue'

const rows = [
  'default',
  'color',
  'size',
  'outlined',
  'outlined-size',
  'ghost',
  'ghost-size',
  'combinations',
]
const colors = {
  default: '',
  neutral: 'xds:suggestion-neutral',
  lead: 'xds:suggestion-lead',
  auxiliary: 'xds:suggestion-auxiliary',
  accent: 'xds:suggestion-accent',
  highlight: 'xds:suggestion-highlight',
  success: 'xds:suggestion-success',
  warning: 'xds:suggestion-warning',
  error: 'xds:suggestion-error',
}

const cleanedValue = (value: string) => value.replace(/^xds:suggestion-/, '')
</script>
