<template>
  <Wrapper feature="Button" :rows="rows">
    <template #default>
      <button class="xds:button">
        <span>button</span>
      </button>
    </template>
    <template #size>
      <button class="xds:button xds:button-sm">sm badge</button>
      <button class="xds:button xds:button-md">md badge</button>
      <button class="xds:button xds:button-lg">lg badge</button>
      <button class="xds:button xds:button-xl">xl badge</button>
    </template>
    <template #layout>
      <button class="xds:button xds:button-circle">+</button>
      <button class="xds:button xds:button-square">+</button>
    </template>
    <template #color>
      <button class="xds:button">button</button>
      <button v-for="(value, key) in colors" :key="key" class="xds:button" :class="value">
        {{ key }} button
      </button>
    </template>
    <template #default-selected>
      <button class="xds:button xds:selected">selected button</button>
      <button
        v-for="(value, key) in colors"
        :key="key"
        class="xds:button xds:selected"
        :class="value"
      >
        selected {{ key }} button
      </button>
    </template>
    <template #outline>
      <button class="xds:button xds:button-outlined">outlined button</button>
      <button
        v-for="(value, key) in colors"
        :key="key"
        class="xds:button xds:button-outlined"
        :class="[value]"
      >
        outline {{ key }} button
      </button>
    </template>
    <template #outline-selected>
      <button class="xds:button xds:selected xds:button-outlined">selected outlined button</button>
      <button
        v-for="(value, key) in colors"
        :key="key"
        class="xds:button xds:selected xds:button-outlined"
        :class="[value]"
      >
        selected outline {{ key }} button
      </button>
    </template>
    <template #ghost>
      <button class="xds:button xds:button-ghost">ghost button</button>
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
      <button class="xds:button xds:button-ghost xds:selected">selected ghost button</button>
      <button
        v-for="(value, key) in colors"
        :key="key"
        class="xds:button xds:button-ghost xds:selected"
        :class="[value]"
      >
        selected ghost {{ key }} button
      </button>
    </template>
    <template #tight>
      <button class="xds:button xds:button-tight">tight button</button>
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
      <button class="xds:button xds:button-tight xds:selected">selected tight button</button>
      <button
        v-for="(value, key) in colors"
        :key="key"
        class="xds:button xds:button-tight xds:selected"
        :class="[value]"
      >
        selected tight {{ key }} button
      </button>
    </template>
    <template #link>
      <button class="xds:button xds:button-link xds:button-xl">link button</button>
      <button
        v-for="(value, key) in colors"
        :key="key"
        class="xds:button xds:button-link xds:button-xl"
        :class="[value]"
      >
        link {{ key }} button
      </button>
    </template>
    <template #link-selected>
      <button class="xds:button xds:button-link xds:selected xds:button-xl">
        selected link button
      </button>
      <button
        v-for="(value, key) in colors"
        :key="key"
        class="xds:button xds:button-link xds:selected xds:button-xl"
        :class="[value]"
      >
        selected link {{ key }} button
      </button>
    </template>
    <template #disabled>
      <button class="xds:button" disabled>button</button>
      <button class="xds:button xds:selected" disabled>selected button</button>
      <button class="xds:button xds:button-outlined" disabled>outlined button</button>
      <button class="xds:button xds:selected xds:button-outlined" disabled>
        selected outlined button
      </button>
      <button class="xds:button xds:button-ghost" disabled>ghost button</button>
      <button class="xds:button xds:selected xds:button-ghost" disabled>
        selected ghost button
      </button>
      <button class="xds:button xds:button-tight" disabled>tight button</button>
      <button class="xds:button xds:selected xds:button-tight" disabled>
        selected tight button
      </button>
      <button class="xds:button xds:button-link xds:button-xl" disabled>link button</button>
      <button class="xds:button xds:selected xds:button-link xds:button-xl" disabled>
        selected link button
      </button>
    </template>
    <template #combinations>
      <button class="xds:button xds:button-lead xds:button-sm">lead sm button</button>
      <button class="xds:button xds:button-outlined xds:button-square xds:button-lg xds:selected">
        +
      </button>
      <button class="xds:button xds:button-auxiliary xds:button-outlined xds:button-circle">
        -
      </button>
      <button class="xds:button xds:button-accent xds:button-tight">accent tight button</button>
      <button class="xds:button xds:button-warning xds:button-ghost">warning ghost button</button>
    </template>
  </Wrapper>
</template>

<script setup lang="ts">
import Wrapper from './wrapper.vue'

const rows = [
  'default',
  'size',
  'layout',
  'color',
  'default-selected',
  'outline',
  'outline-selected',
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
