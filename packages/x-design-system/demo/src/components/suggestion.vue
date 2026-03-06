<template>
  <Wrapper feature="Suggestion" :rows="rows">
    <template #default>
      <button class="xds:suggestion xds:w-30">
        <CuratedIcon class="xds:icon" />
        very long default suggestion to test line wrap alignment
      </button>
    </template>
    <template #color>
      <button class="xds:suggestion">
        <CuratedIcon class="xds:icon" />
        suggestion
      </button>
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
      <button class="xds:suggestion xds:suggestion-outlined">
        <CuratedIcon class="xds:icon" />
        outlined suggestion
      </button>
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
      <button class="xds:suggestion xds:suggestion-ghost">
        <CuratedIcon class="xds:icon" />
        ghost suggestion
      </button>
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
      <button class="xds:suggestion xds:suggestion-success xds:suggestion-md">
        <CuratedIcon class="xds:icon" />
        success md suggestion
      </button>
      <button class="xds:suggestion xds:suggestion-auxiliary xds:suggestion-md">
        <CuratedIcon class="xds:icon" />
        auxiliary md suggestion
      </button>
      <button class="xds:suggestion xds:suggestion-error xds:suggestion-lg">
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
