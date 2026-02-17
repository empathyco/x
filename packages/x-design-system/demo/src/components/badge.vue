<template>
  <Wrapper feature="Badge" :rows="rows">
    <template #default>
      <span class="xds:badge">badge</span>
    </template>
    <template #size>
      <span class="xds:badge xds:badge-sm">sm badge</span>
      <span class="xds:badge xds:badge-md">md badge</span>
    </template>
    <template #circles>
      <span class="xds:badge xds:badge-circle xds:badge-sm">1</span>
      <span class="xds:badge xds:badge-circle xds:badge-md">1</span>
    </template>
  </Wrapper>
</template>

<script setup lang="ts">
import Wrapper from './wrapper.vue'

const rows = ['default', 'size', 'circles']
</script>
