<template>
  <div>
    <BaseScroll>
      <template>
        <div @scroll="scroll" class="content-scroll">
          <ul>
            <li v-for="item in items" :key="item.id">base-scroll-{{ item.id }}</li>
          </ul>
        </div>
      </template>
    </BaseScroll>
    <span>Scroll position: {{ scrollPosition }}</span>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import BaseScroll from '../../../../x-components/src/components/scroll/base-scroll.vue';

  const items = Array.from({ length: 24 }, (_, index) => ({ id: `item-${index}` }));
  const scrollPosition = ref(0);
  const scroll = (position: number): void => (scrollPosition.value = position);
</script>

<style scoped>
  .content-scroll {
    overflow: auto;
    height: 100px;
    display: flex;
    flex-direction: column;
  }
</style>
