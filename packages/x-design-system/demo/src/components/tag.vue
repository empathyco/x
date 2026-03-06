<template>
  <Wrapper feature="Tag" :rows="rows">
    <template #default>
      <button class="xds:tag">
        tag
        <PlusIcon class="xds:icon" />
      </button>
    </template>
    <template #size>
      <button
        v-for="size in ['xds:tag-sm', 'xds:tag-md', 'xds:tag-lg']"
        :key="size"
        class="xds:tag"
        :class="size"
      >
        {{ cleanedValue(size) }} tag
        <PlusIcon class="xds:icon" />
      </button>
    </template>
    <template #color>
      <button class="xds:tag">
        tag
        <PlusIcon class="xds:icon" />
      </button>
      <button v-for="(value, key) in colors" :key="key" class="xds:tag" :class="value">
        {{ key }} tag
        <PlusIcon class="xds:icon" />
      </button>
    </template>
    <template #default-selected>
      <button class="xds:tag xds:selected">
        selected tag
        <PlusIcon class="xds:icon" />
      </button>
      <button v-for="(value, key) in colors" :key="key" class="xds:tag xds:selected" :class="value">
        selected {{ key }} tag
        <PlusIcon class="xds:icon" />
      </button>
    </template>
    <template #outlined>
      <button class="xds:tag xds:tag-outlined">
        outlined tag
        <PlusIcon class="xds:icon" />
      </button>
      <button
        v-for="(value, key) in colors"
        :key="key"
        class="xds:tag xds:tag-outlined"
        :class="[value]"
      >
        outline {{ key }} tag
        <PlusIcon class="xds:icon" />
      </button>
    </template>
    <template #outlined-selected>
      <button class="xds:tag xds:selected xds:tag-outlined">
        selected outlined tag
        <PlusIcon class="xds:icon" />
      </button>
      <button
        v-for="(value, key) in colors"
        :key="key"
        class="xds:tag xds:selected xds:tag-outlined"
        :class="[value]"
      >
        selected outline {{ key }} tag
        <PlusIcon class="xds:icon" />
      </button>
    </template>
    <template #solid>
      <button class="xds:tag xds:tag-solid">
        solid tag
        <PlusIcon class="xds:icon" />
      </button>
      <button
        v-for="(value, key) in colors"
        :key="key"
        class="xds:tag xds:tag-solid"
        :class="[value]"
      >
        solid {{ key }} tag
        <PlusIcon class="xds:icon" />
      </button>
    </template>
    <template #solid-selected>
      <button class="xds:tag xds:selected xds:tag-solid">
        selected solid tag
        <PlusIcon class="xds:icon" />
      </button>
      <button
        v-for="(value, key) in colors"
        :key="key"
        class="xds:tag xds:selected xds:tag-solid"
        :class="[value]"
      >
        selected solid {{ key }} tag
        <PlusIcon class="xds:icon" />
      </button>
    </template>
    <template #ghost>
      <button class="xds:tag xds:tag-ghost">
        ghost tag
        <PlusIcon class="xds:icon" />
      </button>
      <button
        v-for="(value, key) in colors"
        :key="key"
        class="xds:tag xds:tag-ghost"
        :class="[value]"
      >
        ghost {{ key }} tag
        <PlusIcon class="xds:icon" />
      </button>
    </template>
    <template #ghost-selected>
      <button class="xds:tag xds:tag-ghost xds:selected">
        selected ghost tag
        <PlusIcon class="xds:icon" />
      </button>
      <button
        v-for="(value, key) in colors"
        :key="key"
        class="xds:tag xds:tag-ghost xds:selected"
        :class="[value]"
      >
        selected ghost {{ key }} tag
        <PlusIcon class="xds:icon" />
      </button>
    </template>
    <template #tight>
      <button class="xds:tag xds:tag-tight">
        tag button
        <PlusIcon class="xds:icon" />
      </button>
      <button
        v-for="(value, key) in colors"
        :key="key"
        class="xds:tag xds:tag-tight"
        :class="[value]"
      >
        tight {{ key }} tag
        <PlusIcon class="xds:icon" />
      </button>
    </template>
    <template #tight-selected>
      <button class="xds:tag xds:tag-tight xds:selected">
        selected tag button
        <PlusIcon class="xds:icon" />
      </button>
      <button
        v-for="(value, key) in colors"
        :key="key"
        class="xds:tag xds:tag-tight xds:selected"
        :class="[value]"
      >
        selected tight {{ key }} tag
        <PlusIcon class="xds:icon" />
      </button>
    </template>
    <template #disabled>
      <template
        v-for="caseClass in [
          '',
          'xds:tag-outlined',
          'xds:tag-solid',
          'xds:tag-ghost',
          'xds:tag-tight',
        ]"
        :key="caseClass"
      >
        <button class="xds:tag" :class="caseClass">
          {{ cleanedValue(caseClass) }} tag
          <PlusIcon class="xds:icon" />
        </button>
        <button class="xds:tag xds:selected" :class="caseClass">
          selected {{ cleanedValue(caseClass) }} tag
          <PlusIcon class="xds:icon" />
        </button>
      </template>
    </template>
    <template #combinations>
      <button class="xds:tag xds:tag-lead xds:tag-sm">
        lead sm tag
        <PlusIcon class="xds:icon" />
      </button>
      <button class="xds:tag xds:tag-auxiliary xds:tag-outlined xds:tag-lg xds:selected">
        auxiliary outlined lg selected tag
        <PlusIcon class="xds:icon" />
      </button>
      <button class="xds:tag xds:tag-highlight xds:tag-solid xds:tag-lg xds:selected">
        highlight solid lg selected tag
        <PlusIcon class="xds:icon" />
      </button>
      <button class="xds:tag xds:tag-success xds:tag-tight xds:tag-sm xds:selected">
        success tight sm selected tag
        <PlusIcon class="xds:icon" />
      </button>
      <button class="xds:tag xds:tag-warning xds:tag-ghost xds:selected">
        warning ghost selected tag
        <PlusIcon class="xds:icon" />
      </button>
    </template>
  </Wrapper>
</template>

<script setup lang="ts">
import PlusIcon from './icons/plus.svg'
import Wrapper from './wrapper.vue'

const rows = [
  'default',
  'size',
  'color',
  'default-selected',
  'outlined',
  'outlined-selected',
  'solid',
  'solid-selected',
  'ghost',
  'ghost-selected',
  'tight',
  'tight-selected',
  'disabled',
  'combinations',
]
const colors = {
  neutral: 'xds:tag-neutral',
  lead: 'xds:tag-lead',
  auxiliary: 'xds:tag-auxiliary',
  accent: 'xds:tag-accent',
  highlight: 'xds:tag-highlight',
  success: 'xds:tag-success',
  warning: 'xds:tag-warning',
  error: 'xds:tag-error',
}

const cleanedValue = (value: string) => value.replace(/^xds:tag-/, '')
</script>
