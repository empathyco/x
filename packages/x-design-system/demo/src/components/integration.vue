<template>
  <Wrapper feature="Consumer integration and Tailwind v4 capabilities" :rows="rows">
    <template #colorAugmentation>
      <span class="xds:badge xds:badge-tertiary">badge tertiary</span>
      <span class="xds:p-4 xds:bg-enable">enable color</span>
      <span class="xds:p-4 xds:bg-disable">disable color</span>
    </template>
  </Wrapper>
</template>

<script setup lang="ts">
import Wrapper from './wrapper.vue'

const rows = ['colorAugmentation']
</script>
