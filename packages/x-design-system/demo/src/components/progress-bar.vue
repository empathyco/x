<template>
  <Wrapper feature="ProgressBar" :rows="rows">
    <template #default>
      <span>default</span>
      <div class="xds:progress-bar xds:w-320">
        <div class="xds:progress-bar-fill xds:w-[30%]" />
      </div>
    </template>
    <template #size>
      <div class="xds:flex xds:gap-8 xds:items-center xds:mr-16">
        <span>sm</span>
        <div class="xds:progress-bar xds:progress-bar-sm xds:w-320">
          <div class="xds:progress-bar-fill xds:w-[30%]" />
        </div>
      </div>
      <div class="xds:flex xds:gap-8 xds:items-center xds:mr-16">
        <span>lg</span>
        <div class="xds:progress-bar xds:progress-bar-lg xds:w-320">
          <div class="xds:progress-bar-fill xds:w-[30%]" />
        </div>
      </div>
    </template>
    <template #color>
      <div class="xds:flex xds:gap-8 xds:items-center xds:mr-16">
        <span>default</span>
        <div class="xds:progress-bar xds:w-320">
          <div class="xds:progress-bar-fill xds:w-[30%]" />
        </div>
      </div>
      <div
        v-for="(value, key) in colors"
        :key="key"
        class="xds:flex xds:gap-8 xds:mr-16 xds:items-center"
      >
        <span>{{ key }}</span>
        <div class="xds:progress-bar xds:w-320" :class="value">
          <div class="xds:progress-bar-fill xds:w-[30%]" />
        </div>
      </div>
    </template>

    <template #combinations>
      <span>lg warning</span>
      <div class="xds:progress-bar xds:progress-bar-lg xds:progress-bar-warning xds:w-320">
        <div class="xds:progress-bar-fill xds:w-[30%]" />
      </div>
    </template>
  </Wrapper>
</template>

<script setup lang="ts">
import Wrapper from './wrapper.vue'

const rows = ['default', 'size', 'color', 'combinations']
const colors = {
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
