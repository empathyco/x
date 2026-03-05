<template>
  <Wrapper feature="Suggestion Group" :rows="rows">
    <template #default>
      <SuggestionGroup class="xds:w-50">
        very long default suggestion to test line wrap alignment
      </SuggestionGroup>
    </template>
    <template #color>
      <SuggestionGroup class="xds:w-50"> suggestion group </SuggestionGroup>
      <SuggestionGroup v-for="(value, key) in colors" :key="key" :class="value">
        {{ cleanedValue(value) }} suggestion group
      </SuggestionGroup>
    </template>
    <template #size>
      <SuggestionGroup v-for="size in sizes" :key="size" :class="size">
        {{ cleanedValue(size) }} suggestion group
      </SuggestionGroup>
    </template>
    <template #outlined>
      <SuggestionGroup> outlined suggestion group </SuggestionGroup>
      <SuggestionGroup
        v-for="(value, key) in colors"
        :key="key"
        class="xds:suggestion-group-outlined"
        :class="value"
      >
        outlined {{ cleanedValue(value) }} suggestion group
      </SuggestionGroup>
    </template>
    <template #outlined-size>
      <SuggestionGroup
        v-for="size in sizes"
        :key="size"
        class="xds:suggestion-group-outlined"
        :class="size"
      >
        outlined {{ cleanedValue(size) }} suggestion group
      </SuggestionGroup>
    </template>
    <template #ghost>
      <SuggestionGroup class="xds:suggestion-group-ghost"> ghost suggestion </SuggestionGroup>
      <SuggestionGroup
        v-for="(value, key) in colors"
        :key="key"
        class="xds:suggestion-group-ghost"
        :class="value"
      >
        ghost {{ cleanedValue(value) }} suggestion group
      </SuggestionGroup>
    </template>
    <template #ghost-size>
      <SuggestionGroup
        v-for="size in sizes"
        :key="size"
        class="xds:suggestion-group-ghost"
        :class="size"
      >
        ghost {{ cleanedValue(size) }} suggestion group
      </SuggestionGroup>
    </template>
    <template #combinations>
      <SuggestionGroup class="xds:suggestion-group-success xds:suggestion-group-sm">
        success sm suggestion group
      </SuggestionGroup>
      <SuggestionGroup
        class="xds:suggestion-group-outlined xds:suggestion-group-auxiliary xds:suggestion-group-md"
      >
        outlined auxiliary md suggestion group
      </SuggestionGroup>
      <SuggestionGroup class="xds:suggestion-group-ghost xds:suggestion-group-lg">
        ghost lg suggestion group
      </SuggestionGroup>
    </template>
    <template #combinations-layer>
      <SuggestionGroup
        class="xds:suggestion-group-success xds:suggestion-group-sm"
        button-class="xds:suggestion-group-button-rectangle xds:suggestion-group-button-success"
      >
        success sm suggestion group
        <template #button> clear </template>
      </SuggestionGroup>
      <SuggestionGroup
        class="xds:suggestion-group-outlined xds:suggestion-group-auxiliary xds:suggestion-group-md"
        button-class="xds:suggestion-group-button-rectangle xds:suggestion-group-button-ghost"
      >
        outlined auxiliary md suggestion group
        <template #button> clear </template>
      </SuggestionGroup>
      <SuggestionGroup
        class="xds:suggestion-group-ghost xds:suggestion-group-lg"
        button-class="xds:suggestion-group-button-rectangle xds:suggestion-group-button-ghost"
      >
        ghost lg suggestion group
        <template #button> clear </template>
      </SuggestionGroup>
    </template>
  </Wrapper>
</template>

<script setup lang="ts">
import Wrapper from '../wrapper.vue'
import SuggestionGroup from './item.vue'

const rows = [
  'default',
  'color',
  'size',
  'outlined',
  'outlined-size',
  'ghost',
  'ghost-size',
  'combinations',
  'combinations-layer',
]
const colors = {
  neutral: 'xds:suggestion-group-neutral-75',
  lead: 'xds:suggestion-group-lead-75',
  auxiliary: 'xds:suggestion-group-auxiliary-75',
  accent: 'xds:suggestion-group-accent-75',
  highlight: 'xds:suggestion-group-highlight-75',
  success: 'xds:suggestion-group-success-75',
  warning: 'xds:suggestion-group-warning-75',
  error: 'xds:suggestion-group-error-75',
}
const sizes = ['xds:suggestion-group-sm', 'xds:suggestion-group-md', 'xds:suggestion-group-lg']

const cleanedValue = (value: string) => value.replace(/^xds:suggestion-group-/, '')
</script>
