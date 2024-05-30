<template>
  <h1>BasePlaceholderImage</h1>
  <BasePlaceholderImage class="staticClass" :class="{ class: true }" />
  <h1>BaseFallbackImage</h1>
  <BaseFallbackImage class="staticClass" :class="{ class: true }" />
</template>

<script setup lang="ts">
  import BasePlaceholderImage from '../../../../x-components/src/components/result/base-result-placeholder-image.vue';
  import BaseFallbackImage from '../../../../x-components/src/components/result/base-result-fallback-image.vue';
</script>

<style scoped>
  .staticClass {
    height: 300px;
    width: 300px;
  }
  .class {
    border: 1px solid green;
  }
</style>
