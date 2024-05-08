<script setup lang="ts">
  import MainScroll from '../../../../x-components/src/x-modules/scroll/components/main-scroll.vue';
  import MainScrollItem from '../../../../x-components/src/x-modules/scroll/components/main-scroll-item.vue';
  const items = Array.from({ length: 24 }, (_, index) => ({ id: `item-${index}` }));
</script>

<template>
  <MainScroll>
    <ul class="list" data-test="scroll">
      <MainScrollItem v-for="item in items" :key="item.id" class="item" tag="article" :item="item">
        {{ item.id }}
      </MainScrollItem>
    </ul>
  </MainScroll>
</template>

<style scoped lang="scss">
  .list {
    overflow: auto;
    height: 100px;
  }
</style>
