<template>
  <StaggeredFadeAndSlide tag="ul" :stagger="50">
    <li key="1">Element to animate</li>
    <li key="2">Element to animate</li>
    <li key="3">Element to animate</li>
  </StaggeredFadeAndSlide>
</template>

<script setup lang="ts">
  import StaggeredFadeAndSlide from '../../../../x-components/src/components/animations/staggered-fade-and-slide.vue';
</script>
