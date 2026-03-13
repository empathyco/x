<template>
  <Wrapper feature="Progress Bar" :rows="rows">
    <template #default>
      <span>default</span>
      <div class="xds:progress-bar xds:w-320">
        <div class="xds:progress-bar-fill xds:w-[30%]" />
      </div>
    </template>
    <template #size>
      <div class="xds:mr-16 xds:flex xds:items-center xds:gap-8">
        <span>md</span>
        <div class="xds:progress-bar-sm xds:progress-bar xds:w-320">
          <div class="xds:progress-bar-fill xds:w-[30%]" />
        </div>
      </div>
      <div class="xds:mr-16 xds:flex xds:items-center xds:gap-8">
        <span>lg</span>
        <div class="xds:progress-bar xds:progress-bar-lg xds:w-320">
          <div class="xds:progress-bar-fill xds:w-[30%]" />
        </div>
      </div>
    </template>
    <template #color>
      <div
        v-for="(value, key) in colors"
        :key="key"
        class="xds:mr-16 xds:flex xds:items-center xds:gap-8"
      >
        <span>{{ key }}</span>
        <div class="xds:progress-bar xds:w-320" :class="value">
          <div class="xds:progress-bar-fill xds:w-[30%]" />
        </div>
      </div>
    </template>
    <template #combinations>
      <span>lg warning</span>
      <div class="xds:progress-bar xds:progress-bar-lg xds:w-320 xds:progress-bar-warning">
        <div class="xds:progress-bar-fill xds:w-[30%]" />
      </div>
    </template>
  </Wrapper>
</template>

<script setup lang="ts">
import Wrapper from './wrapper.vue'

const rows = ['default', 'size', 'color', 'combinations']
const colors = {
  default: '',
  neutral: 'xds:progress-bar-neutral',
  lead: 'xds:progress-bar-lead',
  auxiliary: 'xds:progress-bar-auxiliary',
  accent: 'xds:progress-bar-accent',
  highlight: 'xds:progress-bar-highlight',
  success: 'xds:progress-bar-success',
  warning: 'xds:progress-bar-warning',
  error: 'xds:progress-bar-error',
}
</script>
