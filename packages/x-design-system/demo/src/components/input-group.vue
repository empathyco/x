<template>
  <Wrapper feature="Input Group" :rows="rows">
    <template #default>
      <div class="xds:input-group" disabled="false">
        <Curated class="xds:icon" />
        <input class="xds:input" placeholder="input-group" />
        <button class="xds:button xds:input-group-button">
          <Cross class="xds:icon" />
        </button>
        <button class="xds:button xds:input-group-button xds:input-group-button-rectangle">
          clear
        </button>
        <button class="xds:button xds:input-group-button-primary">
          <Check class="xds:icon" />
        </button>
      </div>
    </template>

    <template #size>
      <div
        v-for="size in ['xds:input-group-sm', 'xds:input-group-md', 'xds:input-group-lg']"
        :key="size"
        class="xds:input-group"
        :class="[size]"
        disabled="false"
      >
        <Curated class="xds:icon" />
        <input class="xds:input" :placeholder="size" />
        <button class="xds:button xds:input-group-button">
          <Cross class="xds:icon" />
        </button>
        <button class="xds:button xds:input-group-button xds:input-group-button-rectangle">
          clear
        </button>
        <button class="xds:button xds:input-group-button-primary">
          <Check class="xds:icon" />
        </button>
      </div>
    </template>

    <template #color>
      <div
        v-for="(value, key) in colors"
        :key="key"
        class="xds:input-group"
        :class="[value]"
        disabled="false"
      >
        <Curated class="xds:icon" />
        <input class="xds:input" :placeholder="value" />
        <button class="xds:button xds:input-group-button">
          <Cross class="xds:icon" />
        </button>
        <button class="xds:button xds:input-group-button xds:input-group-button-rectangle">
          clear
        </button>
        <button class="xds:button xds:input-group-button-primary">
          <Check class="xds:icon" />
        </button>
      </div>
    </template>
    <template #outlined>
      <div
        v-for="(value, key) in colors"
        :key="key"
        class="xds:input-group"
        :class="[value]"
        disabled="false"
      >
        <Curated class="xds:icon" />
        <input class="xds:input" :placeholder="value" />
        <button class="xds:button xds:input-group-button">
          <Cross class="xds:icon" />
        </button>
        <button class="xds:button xds:input-group-button xds:input-group-button-rectangle">
          clear
        </button>
        <button class="xds:button xds:input-group-button-outlined xds:input-group-button-primary">
          <Check class="xds:icon" />
        </button>
      </div>
    </template>

    <template #ghost>
      <div
        v-for="(value, key) in colors"
        :key="key"
        class="xds:input-group"
        :class="[value]"
        disabled="false"
      >
        <Curated class="xds:icon" />
        <input class="xds:input" :placeholder="value" />
        <button class="xds:button xds:input-group-button">
          <Cross class="xds:icon" />
        </button>
        <button class="xds:button xds:input-group-button xds:input-group-button-rectangle">
          clear
        </button>
        <button class="xds:button xds:input-group-button-ghost xds:input-group-button-primary">
          <Check class="xds:icon" />
        </button>
      </div>
    </template>

    <template #line>
      <div class="xds:input-group xds:input-group-line" disabled="false">
        <Curated class="xds:icon" />
        <input class="xds:input" placeholder="line" />
        <button class="xds:button xds:input-group-button">
          <Cross class="xds:icon" />
        </button>
        <button class="xds:button xds:input-group-button xds:input-group-button-rectangle">
          clear
        </button>
        <button class="xds:button xds:input-group-button-primary">
          <Check class="xds:icon" />
        </button>
      </div>
    </template>

    <template #line-size>
      <div
        v-for="size in ['xds:input-group-sm', 'xds:input-group-md', 'xds:input-group-lg']"
        :key="size"
        class="xds:input-group xds:input-group-line"
        :class="[size]"
        disabled="false"
      >
        <Curated class="xds:icon" />
        <input class="xds:input" :placeholder="size" />
        <button class="xds:button xds:input-group-button">
          <Cross class="xds:icon" />
        </button>
        <button class="xds:button xds:input-group-button xds:input-group-button-rectangle">
          clear
        </button>
        <button class="xds:button xds:input-group-button-primary">
          <Check class="xds:icon" />
        </button>
      </div>
    </template>

    <template #line-color>
      <div
        v-for="(value, key) in colors"
        :key="key"
        class="xds:input-group xds:input-group-line"
        :class="[value]"
        disabled="false"
      >
        <Curated class="xds:icon" />
        <input class="xds:input" :placeholder="value" />
        <button class="xds:button xds:input-group-button">
          <Cross class="xds:icon" />
        </button>
        <button class="xds:button xds:input-group-button xds:input-group-button-rectangle">
          clear
        </button>
        <button class="xds:button xds:input-group-button-primary">
          <Check class="xds:icon" />
        </button>
      </div>
    </template>

    <template #line-outlined>
      <div
        v-for="(value, key) in colors"
        :key="key"
        class="xds:input-group xds:input-group-line"
        :class="[value]"
        disabled="false"
      >
        <Curated class="xds:icon" />
        <input class="xds:input" :placeholder="value" />
        <button class="xds:button xds:input-group-button">
          <Cross class="xds:icon" />
        </button>
        <button class="xds:button xds:input-group-button xds:input-group-button-rectangle">
          clear
        </button>
        <button class="xds:button xds:input-group-button-outlined xds:input-group-button-primary">
          <Check class="xds:icon" />
        </button>
      </div>
    </template>

    <template #line-ghost>
      <div
        v-for="(value, key) in colors"
        :key="key"
        class="xds:input-group xds:input-group-line"
        :class="[value]"
        disabled="false"
      >
        <Curated class="xds:icon" />
        <input class="xds:input" :placeholder="value" />
        <button class="xds:button xds:input-group-button">
          <Cross class="xds:icon" />
        </button>
        <button class="xds:button xds:input-group-button xds:input-group-button-rectangle">
          clear
        </button>
        <button class="xds:button xds:input-group-button-ghost xds:input-group-button-primary">
          <Check class="xds:icon" />
        </button>
      </div>
    </template>

    <template #disabled>
      <div class="xds:input-group" disabled="true">
        <Curated class="xds:icon" />
        <input class="xds:input" placeholder="input-group" disabled />
        <button class="xds:button xds:input-group-button" disabled>
          <Cross class="xds:icon" />
        </button>
        <button class="xds:button xds:input-group-button xds:input-group-button-rectangle" disabled>
          clear
        </button>
        <button class="xds:button xds:input-group-button-primary" disabled>
          <Check class="xds:icon" />
        </button>
      </div>

      <div class="xds:input-group xds:input-group-line" disabled="true">
        <Curated class="xds:icon" />
        <input class="xds:input" placeholder="line" disabled />
        <button class="xds:button xds:input-group-button" disabled>
          <Cross class="xds:icon" />
        </button>
        <button class="xds:button xds:input-group-button xds:input-group-button-rectangle" disabled>
          clear
        </button>
        <button class="xds:button xds:input-group-button-primary" disabled>
          <Check class="xds:icon" />
        </button>
      </div>
    </template>

    <template #combinations>
      <div class="xds:input-group xds:input-group-lead xds:input-group-sm" disabled="true">
        <Curated class="xds:icon" />
        <input class="xds:input" placeholder="lead sm" disabled />
        <button class="xds:button xds:input-group-button" disabled>
          <Cross class="xds:icon" />
        </button>
        <button class="xds:button xds:input-group-button xds:input-group-button-rectangle" disabled>
          clear
        </button>
        <button class="xds:button xds:input-group-button-primary" disabled>
          <Check class="xds:icon" />
        </button>
      </div>

      <div
        class="xds:input-group xds:input-group-auxiliary xds:input-group-sm xds:input-group-line"
        disabled="true"
      >
        <Curated class="xds:icon" />
        <input class="xds:input" placeholder="auxiliary sm line" disabled />
        <button class="xds:button xds:input-group-button" disabled>
          <Cross class="xds:icon" />
        </button>
        <button class="xds:button xds:input-group-button xds:input-group-button-rectangle" disabled>
          clear
        </button>
        <button class="xds:button xds:input-group-button-primary" disabled>
          <Check class="xds:icon" />
        </button>
      </div>

      <div class="xds:input-group xds:input-group-accent xds:input-group-lg" disabled="true">
        <Curated class="xds:icon" />
        <input class="xds:input" placeholder="accent lg" disabled />
        <button class="xds:button xds:input-group-button" disabled>
          <Cross class="xds:icon" />
        </button>
        <button class="xds:button xds:input-group-button xds:input-group-button-rectangle" disabled>
          clear
        </button>
        <button class="xds:button xds:input-group-button-primary" disabled>
          <Check class="xds:icon" />
        </button>
      </div>

      <div
        class="xds:input-group xds:input-group-warning xds:input-group-line xds:input-group-lg"
        disabled="true"
      >
        <Curated class="xds:icon" />
        <input class="xds:input" placeholder="warning line lg" disabled />
        <button class="xds:button xds:input-group-button" disabled>
          <Cross class="xds:icon" />
        </button>
        <button class="xds:button xds:input-group-button xds:input-group-button-rectangle" disabled>
          clear
        </button>
        <button class="xds:button xds:input-group-button-primary" disabled>
          <Check class="xds:icon" />
        </button>
      </div>
    </template>
  </Wrapper>
</template>

<script setup lang="ts">
import Check from './icons/check.svg'
import Cross from './icons/cross.svg'
import Curated from './icons/curated.svg'
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
</script>
