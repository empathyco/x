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
    <template #attach-to>
      <span class="xds:attach-container xds:badge xds:badge-md xds:badge-outlined">
        attach top-left
        <span class="xds:attach-top-left xds:badge xds:badge-sm">10</span>
      </span>
      <span class="xds:attach-container xds:badge xds:badge-md xds:badge-outlined">
        attach top-right
        <span class="xds:attach-top-right xds:badge xds:badge-sm">10</span>
      </span>
      <span class="xds:attach-container xds:badge xds:badge-md xds:badge-outlined">
        attach bottom-left
        <span class="xds:attach-bottom-left xds:badge xds:badge-sm">10</span>
      </span>
      <span class="xds:attach-container xds:badge xds:badge-md xds:badge-outlined">
        attach bottom-right
        <span class="xds:attach-bottom-right xds:badge xds:badge-sm">10</span>
      </span>

      <span class="xds:attach-container xds:badge xds:badge-md xds:badge-outlined">
        attach badge-md
        <span class="xds:attach-top-right xds:badge xds:badge-md">10</span>
      </span>
      <span class="xds:attach-container xds:badge xds:badge-md xds:badge-outlined">
        attach badge-circle
        <span class="xds:attach-bottom-right xds:badge xds:badge-md xds:badge-circle">10</span>
      </span>
    </template>
    <template #with-icon>
      <span class="xds:badge">
        <CuratedIcon class="xds:icon" />
      </span>
      <span class="xds:badge xds:badge-sm xds:badge-accent">
        <CuratedIcon class="xds:icon" />
      </span>
      <span class="xds:badge xds:badge-circle">
        <CuratedIcon class="xds:icon" />
      </span>
      <span class="xds:badge xds:badge-circle xds:badge-sm xds:badge-accent">
        <CuratedIcon class="xds:icon" />
      </span>
    </template>
    <template #combinations>
      <span class="xds:badge xds:badge-error xds:badge-sm xds:badge-outlined">
        error sm outlined badge
      </span>
      <span class="xds:badge xds:badge-light xds:badge-md xds:badge-lead xds:badge-circle">1</span>
      <span class="xds:badge xds:badge-outlined xds:badge-sm xds:badge-warning xds:badge-circle">
        1
      </span>
      <span class="xds:badge xds:badge-light xds:badge-md xds:badge-auxiliary">
        light md auxiliary badge
      </span>
      <span class="xds:attach-container xds:badge xds:badge-md xds:badge-outlined">
        circle attach-to-top-right
        <span class="xds:attach-top-right xds:badge xds:badge-sm xds:badge-circle">10</span>
      </span>
      <span class="xds:attach-container xds:badge xds:badge-md xds:badge-outlined">
        sm highlight attach-to-top-right
        <span class="xds:attach-top-right xds:badge xds:badge-sm xds:badge-highlight">10</span>
      </span>
    </template>
  </Wrapper>
</template>

<script setup lang="ts">
import CuratedIcon from './icons/curated.svg'
import Wrapper from './wrapper.vue'

const rows = [
  'default',
  'size',
  'circle',
  'color',
  'light',
  'outlined',
  'bright',
  'attach-to',
  'with-icon',
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
