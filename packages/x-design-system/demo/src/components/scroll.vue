<template>
  <Wrapper feature="Scroll" :rows="rows">
    <template #default>
      <div class="xds:scroll xds:h-50 xds:w-50 xds:bg-amber-400">
        <div class="xds:h-250"></div>
      </div>
    </template>
  </Wrapper>
</template>
<script setup lang="ts">
import Wrapper from './wrapper.vue'

const rows = ['default']
</script>
