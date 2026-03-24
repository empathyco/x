<template>
  <Wrapper feature="Highlight" :rows="rows">
    <template #default>
      <div class="xds:highlight-text">
        <span>Def</span>
        <span class="xds:highlight-text-match">ault</span>
      </div>
    </template>
  </Wrapper>
</template>

<script setup lang="ts">
import Wrapper from './wrapper.vue'

const rows = ['default']
</script>
