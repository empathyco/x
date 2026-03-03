<template>
  <Wrapper feature="Input Group" :rows="rows">
    <template #default>
      <InputGroupBase placeholder="input-group" />
    </template>

    <template #size>
      <InputGroupBase
        v-for="size in ['xds:input-group-sm', 'xds:input-group-md', 'xds:input-group-lg']"
        :key="size"
        :placeholder="cleanedValue(size)"
        :wrapper-class="size"
      />
    </template>

    <template #color>
      <InputGroupBase
        v-for="(value, key) in colors"
        :key="key"
        :placeholder="cleanedValue(value)"
        :wrapper-class="value"
      />
    </template>
    <template #outlined>
      <InputGroupBase
        v-for="(value, key) in colors"
        :key="key"
        :placeholder="cleanedValue(value)"
        :wrapper-class="value"
        button-class="xds:input-group-button-outlined"
      />
    </template>

    <template #ghost>
      <InputGroupBase
        v-for="(value, key) in colors"
        :key="key"
        :placeholder="cleanedValue(value)"
        :wrapper-class="value"
        button-class="xds:input-group-button-ghost"
      />
    </template>

    <template #line>
      <InputGroupBase placeholder="line" wrapper-class="xds:input-group-line" />
    </template>

    <template #line-size>
      <InputGroupBase
        v-for="size in ['xds:input-group-sm', 'xds:input-group-md', 'xds:input-group-lg']"
        :key="size"
        :placeholder="cleanedValue(size)"
        :wrapper-class="size"
      />
    </template>

    <template #line-color>
      <InputGroupBase
        v-for="(value, key) in colors"
        :key="key"
        :placeholder="cleanedValue(value)"
        wrapper-class="xds:input-group-line"
      />
    </template>

    <template #line-outlined>
      <InputGroupBase
        v-for="(value, key) in colors"
        :key="key"
        :placeholder="cleanedValue(value)"
        wrapper-class="xds:input-group-line"
        button-class="xds:input-group-button-outlined"
      />
    </template>

    <template #line-ghost>
      <InputGroupBase
        v-for="(value, key) in colors"
        :key="key"
        :placeholder="cleanedValue(value)"
        wrapper-class="xds:input-group-line"
        button-class="xds:input-group-button-ghost"
      />
    </template>

    <template #disabled>
      <InputGroupBase placeholder="input-group" disabled />

      <InputGroupBase placeholder="line" wrapper-class="xds:input-group-line" disabled />
    </template>

    <template #combinations>
      <InputGroupBase
        placeholder="lead sm"
        wrapper-class="xds:input-group-lead xds:input-group-sm"
      />

      <InputGroupBase
        placeholder="auxiliary sm line"
        wrapper-class="xds:input-group-auxiliary xds:input-group-sm xds:input-group-line"
      />

      <InputGroupBase
        placeholder="accent lg"
        wrapper-class="xds:input-group-accent xds:input-group-lg"
      />

      <InputGroupBase
        placeholder="warning lg line"
        wrapper-class="xds:input-group-warning xds:input-group-line xds:input-group-lg"
      />
    </template>
  </Wrapper>
</template>

<script setup lang="ts">
import InputGroupBase from './input-group-base.vue'
import Wrapper from './wrapper.vue'

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
