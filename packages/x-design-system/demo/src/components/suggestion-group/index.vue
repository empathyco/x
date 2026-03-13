<template>
  <Wrapper feature="Suggestion Group" :rows="rows">
    <template #default>
      <SuggestionGroup class="xds:w-50">
        very long default suggestion to test line wrap alignment
      </SuggestionGroup>
    </template>
    <template #color>
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
      <SuggestionGroup class="xds:suggestion-group-sm xds:suggestion-group-success">
        success sm suggestion group
      </SuggestionGroup>
      <SuggestionGroup
        class="xds:suggestion-group-outlined xds:suggestion-group-md xds:suggestion-group-auxiliary"
      >
        outlined auxiliary md suggestion group
      </SuggestionGroup>
      <SuggestionGroup class="xds:suggestion-group-ghost xds:suggestion-group-lg">
        ghost lg suggestion group
      </SuggestionGroup>
    </template>
    <template #combinations-layer>
      <SuggestionGroup
        class="xds:suggestion-group-sm xds:suggestion-group-success"
        button-class="xds:suggestion-group-button-rectangle xds:suggestion-group-button-lighter"
      >
        success sm suggestion group
        <template #button> clear </template>
      </SuggestionGroup>
      <SuggestionGroup
        class="xds:suggestion-group-outlined xds:suggestion-group-md xds:suggestion-group-auxiliary"
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
  default: '',
  neutral: 'xds:suggestion-group-neutral',
  lead: 'xds:suggestion-group-lead',
  auxiliary: 'xds:suggestion-group-auxiliary',
  accent: 'xds:suggestion-group-accent',
  highlight: 'xds:suggestion-group-highlight',
  success: 'xds:suggestion-group-success',
  warning: 'xds:suggestion-group-warning',
  error: 'xds:suggestion-group-error',
}
const sizes = ['xds:suggestion-group-sm', 'xds:suggestion-group-md', 'xds:suggestion-group-lg']

const cleanedValue = (value: string) => value.replace(/^xds:suggestion-group-/, '')
</script>
