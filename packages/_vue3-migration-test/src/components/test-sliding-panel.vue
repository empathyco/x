<template>
  <SlidingPanel style="width: 300px">
    <span v-for="item in items" :key="item">Item {{ item }}</span>
  </SlidingPanel>
  <button @click="updateItems">Update items</button>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import SlidingPanel from '../../../x-components/src/components/sliding-panel.vue';

  const items = ref<number[]>([]);

  const updateItems = () => (items.value = [...Array(Math.floor(Math.random() * 100)).keys()]);
  updateItems();
</script>
