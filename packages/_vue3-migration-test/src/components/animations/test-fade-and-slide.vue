<template>
  <button @click="toggleItems">Toggle</button>
  <FadeAndSlide tag="ul">
    <li v-for="item in items" :key="item">
      {{ item }}
    </li>
  </FadeAndSlide>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import FadeAndSlide from '../../../../x-components/src/components/animations/fade-and-slide.vue';

  const items = ref<string[]>([]);
  const toggleItems = () =>
    (items.value = items.value.length ? [] : [1, 2, 3, 4, 5].map(i => `Item number ${i}`));
</script>
