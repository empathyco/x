<template>
  <Wrapper feature="Button" :rows="rows">
    <template #default>
      <button class="xds:button">button</button>
    </template>
    <template #size>
      <button class="xds:button xds:button-sm">sm badge</button>
      <button class="xds:button xds:button-md">md badge</button>
      <button class="xds:button xds:button-lg">lg badge</button>
      <button class="xds:button xds:button-xl">xl badge</button>
    </template>
    <template #layout>
      <button class="xds:button xds:button-circle">
        <CuratedIcon class="xds:icon" />
      </button>
      <button class="xds:button xds:button-square">
        <CuratedIcon class="xds:icon" />
      </button>
    </template>
    <template #color>
      <button v-for="(value, key) in colors" :key="key" class="xds:button" :class="value">
        {{ key }} button
      </button>
    </template>
    <template #default-selected>
      <button
        v-for="(value, key) in colors"
        :key="key"
        class="xds:selected xds:button"
        :class="value"
      >
        selected {{ key }} button
      </button>
    </template>
    <template #outlined>
      <button
        v-for="(value, key) in colors"
        :key="key"
        class="xds:button xds:button-outlined"
        :class="[value]"
      >
        outline {{ key }} button
      </button>
    </template>
    <template #outlined-selected>
      <button
        v-for="(value, key) in colors"
        :key="key"
        class="xds:selected xds:button xds:button-outlined"
        :class="[value]"
      >
        selected outline {{ key }} button
      </button>
    </template>
    <template #ghost>
      <button
        v-for="(value, key) in colors"
        :key="key"
        class="xds:button xds:button-ghost"
        :class="[value]"
      >
        ghost {{ key }} button
      </button>
    </template>
    <template #ghost-selected>
      <button
        v-for="(value, key) in colors"
        :key="key"
        class="xds:selected xds:button xds:button-ghost"
        :class="[value]"
      >
        selected ghost {{ key }} button
      </button>
    </template>
    <template #tight>
      <button
        v-for="(value, key) in colors"
        :key="key"
        class="xds:button xds:button-tight"
        :class="[value]"
      >
        tight {{ key }} button
      </button>
    </template>
    <template #tight-selected>
      <button
        v-for="(value, key) in colors"
        :key="key"
        class="xds:selected xds:button xds:button-tight"
        :class="[value]"
      >
        selected tight {{ key }} button
      </button>
    </template>
    <template #link>
      <div class="xds:flex xds:flex-row xds:flex-wrap xds:gap-16 xds:text-md">
        <button
          v-for="(value, key) in colors"
          :key="key"
          class="xds:button xds:button-link"
          :class="[value]"
        >
          link {{ key }} button
        </button>
      </div>
    </template>
    <template #link-selected>
      <div class="xds:flex xds:flex-row xds:flex-wrap xds:gap-16 xds:text-md">
        <button
          v-for="(value, key) in colors"
          :key="key"
          class="xds:selected xds:button xds:button-link"
          :class="[value]"
        >
          selected link {{ key }} button
        </button>
      </div>
    </template>
    <template #disabled>
      <button class="xds:button" disabled>button</button>
      <button class="xds:selected xds:button" disabled>selected button</button>
      <button class="xds:button xds:button-outlined" disabled>outlined button</button>
      <button class="xds:selected xds:button xds:button-outlined" disabled>
        selected outlined button
      </button>
      <button class="xds:button xds:button-ghost" disabled>ghost button</button>
      <button class="xds:selected xds:button xds:button-ghost" disabled>
        selected ghost button
      </button>
      <button class="xds:button xds:button-tight" disabled>tight button</button>
      <button class="xds:selected xds:button xds:button-tight" disabled>
        selected tight button
      </button>
      <button class="xds:button xds:button-link xds:button-xl" disabled>link button</button>
      <button class="xds:selected xds:button xds:button-link xds:button-xl" disabled>
        selected link button
      </button>
    </template>
    <template #combinations>
      <button class="xds:button xds:button-sm xds:button-lead">
        <CuratedIcon class="xds:icon" />
        lead sm button
      </button>
      <button class="xds:selected xds:button xds:button-square xds:button-lg xds:button-outlined">
        <CuratedIcon class="xds:icon" />
      </button>
      <button class="xds:button xds:button-circle xds:button-outlined xds:button-auxiliary">
        <CuratedIcon class="xds:icon" />
      </button>
      <button class="xds:button xds:button-tight xds:button-accent">
        <CuratedIcon class="xds:icon" />
        accent tight button
      </button>
      <button class="xds:button xds:button-ghost xds:button-warning">
        <CuratedIcon class="xds:icon" />
        warning ghost button
      </button>
    </template>
  </Wrapper>
</template>

<script setup lang="ts">
import CuratedIcon from './icons/curated.svg'
import Wrapper from './wrapper.vue'

const rows = [
  'default',
  'size',
  'layout',
  'color',
  'default-selected',
  'outlined',
  'outlined-selected',
  'ghost',
  'ghost-selected',
  'tight',
  'tight-selected',
  'link',
  'link-selected',
  'disabled',
  'combinations',
]
const colors = {
  default: '',
  neutral: 'xds:button-neutral',
  lead: 'xds:button-lead',
  auxiliary: 'xds:button-auxiliary',
  accent: 'xds:button-accent',
  highlight: 'xds:button-highlight',
  success: 'xds:button-success',
  warning: 'xds:button-warning',
  error: 'xds:button-error',
}
</script>
