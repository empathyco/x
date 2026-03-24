<template>
  <Wrapper feature="Consumer integration and Tailwind v4 capabilities" :rows="rows">
    <template #colorAugmentation>
      <span class="xds:badge-tertiary xds:badge">badge tertiary</span>
      <span class="xds:bg-enable xds:p-4">enable color</span>
      <span class="xds:bg-disable xds:p-4">disable color</span>
    </template>
  </Wrapper>
</template>

<script setup lang="ts">
import Wrapper from './wrapper.vue'

const rows = ['colorAugmentation']
</script>
