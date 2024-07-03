<template>
  <MainScroll class="CLASS-TEST" data-custom="DATA-TEST">
    <ul class="list" data-test="scroll">
      <MainScrollItem v-for="item in items" :key="item.id" class="item" tag="article" :item="item">
        {{ item.id }}
      </MainScrollItem>
    </ul>
  </MainScroll>
  <MainScroll>
    <ul class="list" data-test="scroll">
      <MainScrollItem v-for="item in items" :key="item.id" class="item" tag="article" :item="item">
        {{ item.id }}
      </MainScrollItem>
    </ul>
  </MainScroll>
</template>

<script setup lang="ts">
  import { useXBus } from '../../../../x-components/src/composables/use-x-bus';
  import { XEvent } from '../../../../x-components/src/wiring/events.types';
  import MainScroll from '../../../../x-components/src/x-modules/scroll/components/main-scroll.vue';
  import MainScrollItem from '../../../../x-components/src/x-modules/scroll/components/main-scroll-item.vue';

  const items = Array.from({ length: 24 }, (_, index) => ({ id: `item-${index}` }));

  const xBus = useXBus();
  const events: XEvent[] = [
    'UserScrolledToElement',
    'ScrollRestoreSucceeded',
    'ScrollRestoreFailed'
  ];
  events.forEach(event => {
    // eslint-disable-next-line no-console
    xBus.on(event, true).subscribe(args => console.log(`${event} event ->`, args));
  });
</script>

<style scoped lang="scss">
  .list {
    overflow: auto;
    height: 100px;
  }
</style>
