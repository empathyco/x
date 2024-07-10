<template>
  <Scroll
    @scroll="onScroll"
    @scroll:direction-change="onScrollDirectionChange"
    @scroll:at-start="onScrollAtStart"
    @scroll:almost-at-end="onScrollAlmostAtEnd"
    @scroll:at-end="onScrollAtEnd"
    id="main-scroll"
  >
    <ul>
      <li v-for="item in items" :key="item.id">base-scroll-{{ item.id }}</li>
    </ul>
  </Scroll>
  <ScrollToTop :threshold-px="100" class="x-button--round" scroll-id="main-scroll">
    <span>Top</span>
  </ScrollToTop>
  <table>
    <tr>
      <td>Position</td>
      <td>Direction</td>
      <td>At start</td>
      <td>Almost at end</td>
      <td>At end</td>
    </tr>
    <tr style="font-weight: bold">
      <td>{{ scroll }}</td>
      <td>{{ scrollDirection }}</td>
      <td>{{ isScrollAtStart }}</td>
      <td>{{ isScrollAlmostAtEnd }}</td>
      <td>{{ isScrollAtEnd }}</td>
    </tr>
  </table>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import Scroll from '../../../../x-components/src/x-modules/scroll/components/scroll.vue';
  import { ScrollDirection } from '../../../../x-components/src/components/scroll/scroll.types';
  import ScrollToTop from '../../../../x-components/src/x-modules/scroll/components/scroll-to-top.vue';

  const items = Array.from({ length: 24 }, (_, index) => ({ id: `item-${index}` }));
  const scroll = ref(0);
  const scrollDirection = ref<ScrollDirection>('UP');
  const isScrollAtStart = ref(false);
  const isScrollAlmostAtEnd = ref(false);
  const isScrollAtEnd = ref(false);

  const onScroll = (pos: number) => (scroll.value = pos);
  const onScrollDirectionChange = (dir: ScrollDirection) => (scrollDirection.value = dir);
  const onScrollAtStart = (is: boolean) => (isScrollAtStart.value = is);
  const onScrollAlmostAtEnd = (is: boolean) => (isScrollAlmostAtEnd.value = is);
  const onScrollAtEnd = (is: boolean) => (isScrollAtEnd.value = is);
</script>

<style>
  /* Inheritance of `design-system-deprecated` */
  .x-base-scroll {
    overflow: auto;
    height: 100px;
  }
</style>
