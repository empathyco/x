<template>
  <Wrapper feature="Facet Filter" :rows="rows">
    <template #default>
      <button class="xds:filter-facet xds:w-50">
        <Uncheck class="xds:icon" />
        <span>very long default filter to test line wrap alignment</span>
        <span>(123)</span>
      </button>
    </template>
    <template #size>
      <div class="xds:flex xds:flex-row xds:flex-wrap xds:items-baseline xds:gap-4">
        <button
          v-for="size in ['xds:filter-facet-sm', 'xds:filter-facet-md', 'xds:filter-facet-lg']"
          :key="size"
          class="xds:filter-facet"
          :class="[size]"
        >
          <Uncheck class="xds:icon" />
          <span>{{ size }}</span>
          <span>(123)</span>
        </button>
      </div>
    </template>
    <template #color>
      <button v-for="(value, key) in colors" :key="key" class="xds:filter-facet" :class="value">
        <Uncheck class="xds:icon" />
        <span>{{ value }}</span>
        <span>(123)</span>
      </button>
    </template>
    <template #selected-color>
      <button
        v-for="(value, key) in colors"
        :key="key"
        class="xds:filter-facet xds:selected"
        :class="value"
      >
        <Check class="xds:icon" />
        <span>{{ value }} xds:selected</span>
        <span>(123)</span>
      </button>
    </template>
    <template #underline>
      <button
        v-for="(value, key) in colors"
        :key="key"
        class="xds:filter-facet xds:filter-facet-underline"
        :class="value"
      >
        <Uncheck class="xds:icon" />
        <span>{{ value }} xds:filter-facet-underline</span>
        <span>(123)</span>
      </button>
    </template>
    <template #selected-underline>
      <button
        v-for="(value, key) in colors"
        :key="key"
        class="xds:filter-facet xds:filter-facet-underline xds:selected"
        :class="value"
      >
        <Check class="xds:icon" />
        <span>{{ value }} xds:filter-facet-underline xds:selected</span>
        <span>(123)</span>
      </button>
    </template>
    <template #ghost>
      <button
        v-for="(value, key) in colors"
        :key="key"
        class="xds:filter-facet xds:filter-facet-ghost"
        :class="value"
      >
        <Uncheck class="xds:icon" />
        <span>{{ value }} xds:filter-facet-ghost</span>
        <span>(123)</span>
      </button>
    </template>
    <template #selected-ghost>
      <button
        v-for="(value, key) in colors"
        :key="key"
        class="xds:filter-facet xds:filter-facet-ghost xds:selected"
        :class="value"
      >
        <Check class="xds:icon" />
        <span>{{ value }} xds:filter-facet-ghost xds:selected</span>
        <span>(123)</span>
      </button>
    </template>
    <template #simple>
      <button
        v-for="(value, key) in colors"
        :key="key"
        class="xds:filter-facet xds:filter-facet-simple"
        :class="value"
      >
        <Uncheck class="xds:icon" />
        <span>{{ value }} xds:filter-facet-simple</span>
        <span>(123)</span>
      </button>
    </template>
    <template #selected-simple>
      <button
        v-for="(value, key) in colors"
        :key="key"
        class="xds:filter-facet xds:filter-facet-simple xds:selected"
        :class="value"
      >
        <Check class="xds:icon" />
        <span>{{ value }} xds:filter-facet-simple xds:selected</span>
        <span>(123)</span>
      </button>
    </template>
    <template #disabled>
      <button
        v-for="(value, key) in disabled"
        :key="key"
        class="xds:filter-facet"
        :class="value"
        disabled
      >
        <Uncheck class="xds:icon" />
        <span>filter</span>
        <span>(123)</span>
      </button>
    </template>
    <template #combinations>
      <button
        v-for="(value, key) in combinations"
        :key="key"
        class="xds:filter-facet"
        :class="value"
      >
        <Uncheck class="xds:icon" />
        <span>filter</span>
        <span class="xds:badge xds:badge-circle xds:badge-light xds:badge-lead"> 1 </span>
      </button>
    </template>
  </Wrapper>
</template>

<script setup lang="ts">
import Check from './icons/check.svg'
import Uncheck from './icons/uncheck.svg'
import Wrapper from './wrapper.vue'

const rows = [
  'default',
  'size',
  'color',
  'selected-color',
  'underline',
  'selected-underline',
  'ghost',
  'selected-ghost',
  'simple',
  'selected-simple',
  'disabled',
  'combinations',
]

const colors = {
  neutral: 'xds:filter-facet-neutral',
  lead: 'xds:filter-facet-lead',
  auxiliary: 'xds:filter-facet-auxiliary',
  accent: 'xds:filter-facet-accent',
  highlight: 'xds:filter-facet-highlight',
  success: 'xds:filter-facet-success',
  warning: 'xds:filter-facet-warning',
  error: 'xds:filter-facet-error',
}

const disabled = [
  '',
  'xds:selected',
  'xds:filter-facet-ghost',
  'xds:filter-facet-ghost xds:selected',
  'xds:filter-facet-underline',
  'xds:filter-facet-underline xds:selected',
  'xds:filter-facet-simple',
  'xds:filter-facet-simple xds:selected',
]

const combinations = [
  'xds:filter-facet-ghost xds:filter-facet-lg xds:filter-facet-warning xds:selected',
  'xds:filter-facet-ghost xds:filter-facet-success xds:filter-facet-underline xds:selected',
  'xds:filter-facet-simple xds:filter-facet-lg xds:filter-facet-success xds:filter-facet-underline xds:selected',
]
</script>
