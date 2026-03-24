<template>
  <Wrapper feature="Input Group" :rows="rows">
    <template #default>
      <InputGroup placeholder="input-group" />
    </template>
    <template #size>
      <InputGroup
        v-for="size in ['xds:input-group-sm', 'xds:input-group-md', 'xds:input-group-lg']"
        :key="size"
        :placeholder="cleanedValue(size)"
        :wrapper-class="size"
      />
    </template>
    <template #color>
      <InputGroup
        v-for="(value, key) in colors"
        :key="key"
        :placeholder="cleanedValue(value)"
        :wrapper-class="value"
      />
    </template>
    <template #outlined>
      <InputGroup
        v-for="(value, key) in colors"
        :key="key"
        :placeholder="cleanedValue(value)"
        :wrapper-class="value"
        button-class="xds:input-group-button-outlined"
      />
    </template>
    <template #ghost>
      <InputGroup
        v-for="(value, key) in colors"
        :key="key"
        :placeholder="cleanedValue(value)"
        :wrapper-class="value"
        button-class="xds:input-group-button-ghost"
      />
    </template>
    <template #line>
      <InputGroup placeholder="line" wrapper-class="xds:input-group-line" />
    </template>
    <template #line-size>
      <InputGroup
        v-for="size in ['xds:input-group-sm', 'xds:input-group-md', 'xds:input-group-lg']"
        :key="size"
        :placeholder="cleanedValue(size)"
        :wrapper-class="`xds:input-group-line ${size}`"
      />
    </template>
    <template #line-color>
      <InputGroup
        v-for="(value, key) in colors"
        :key="key"
        :placeholder="cleanedValue(value)"
        :wrapper-class="`xds:input-group-line ${value}`"
      />
    </template>
    <template #line-outlined>
      <InputGroup
        v-for="(value, key) in colors"
        :key="key"
        :placeholder="cleanedValue(value)"
        :wrapper-class="`xds:input-group-line ${value}`"
        button-class="xds:input-group-button-outlined"
      />
    </template>
    <template #line-ghost>
      <InputGroup
        v-for="(value, key) in colors"
        :key="key"
        :placeholder="cleanedValue(value)"
        :wrapper-class="`xds:input-group-line ${value}`"
        button-class="xds:input-group-button-ghost"
      />
    </template>
    <template #disabled>
      <InputGroup placeholder="input-group" disabled />
      <InputGroup placeholder="line" wrapper-class="xds:input-group-line" disabled />
    </template>
    <template #combinations>
      <InputGroup placeholder="lead sm" wrapper-class="xds:input-group-lead xds:input-group-sm" />
      <InputGroup
        placeholder="auxiliary sm line"
        wrapper-class="xds:input-group-auxiliary xds:input-group-sm xds:input-group-line"
      />
      <InputGroup
        placeholder="accent lg"
        wrapper-class="xds:input-group-accent xds:input-group-lg"
      />
      <InputGroup
        placeholder="warning lg line"
        wrapper-class="xds:input-group-warning xds:input-group-line xds:input-group-lg"
      />
    </template>
  </Wrapper>
</template>

<script setup lang="ts">
import Wrapper from '../wrapper.vue'
import InputGroup from './item.vue'

const rows = [
  'default',
  'size',
  'color',
  'outlined',
  'ghost',
  'line',
  'line-size',
  'line-color',
  'line-outlined',
  'line-ghost',
  'disabled',
  'combinations',
]
const colors = {
  neutral: 'xds:input-group-neutral',
  lead: 'xds:input-group-lead',
  auxiliary: 'xds:input-group-auxiliary',
  accent: 'xds:input-group-accent',
  highlight: 'xds:input-group-highlight',
  success: 'xds:input-group-success',
  warning: 'xds:input-group-warning',
  error: 'xds:input-group-error',
}

const cleanedValue = (value: string) => value.replace(/^xds:input-group-/, '')
</script>
