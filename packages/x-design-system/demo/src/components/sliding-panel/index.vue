<template>
  <Wrapper feature="Sliding Panel" :rows="rows">
    <template #default>
      <SlidingPanel />
    </template>
    <template #buttons>
      <SlidingPanel />
      <SlidingPanel wrapper-class="xds:sliding-panel-buttons-center" />
      <SlidingPanel wrapper-class="xds:sliding-panel-buttons-outside" />
    </template>
    <template #hover>
      <SlidingPanel wrapper-class="xds:sliding-panel-show-buttons-on-hover" />
      <SlidingPanel
        wrapper-class="xds:sliding-panel-show-buttons-on-hover xds:sliding-panel-at-start"
      />
      <SlidingPanel
        wrapper-class="xds:sliding-panel-show-buttons-on-hover xds:sliding-panel-at-end"
      />
    </template>
    <template #fade>
      <SlidingPanel content-class="xds:sliding-panel-fade" />
      <SlidingPanel
        wrapper-class="xds:sliding-panel-at-start"
        content-class="xds:sliding-panel-fade"
      />
      <SlidingPanel
        wrapper-class="xds:sliding-panel-at-end"
        content-class="xds:sliding-panel-fade"
      />
      <SlidingPanel
        wrapper-class="xds:sliding-panel-at-start xds:sliding-panel-at-end"
        content-class="xds:sliding-panel-fade"
      />
    </template>
    <template #fade-size>
      <SlidingPanel content-class="xds:sliding-panel-fade-sm" />
      <SlidingPanel content-class="xds:sliding-panel-fade-md" />
      <SlidingPanel content-class="xds:sliding-panel-fade-lg" />
    </template>
    <template #combinations>
      <SlidingPanel
        wrapper-class="xds:sliding-panel-buttons-center xds:sliding-panel-show-buttons-on-hover"
        content-class="xds:sliding-panel-fade-lg"
      />
      <SlidingPanel
        wrapper-class="xds:sliding-panel-outside xds:sliding-panel-show-buttons-on-hover"
        content-class="xds:sliding-panel-fade-sm"
      />
      <SlidingPanel
        wrapper-class="xds:sliding-panel-outside xds:sliding-panel-show-buttons-on-hover xds:sliding-panel-at-start"
        content-class="xds:sliding-panel-fade-sm"
      />
      <SlidingPanel
        wrapper-class="xds:sliding-panel-buttons-center xds:sliding-panel-show-buttons-on-hover xds:sliding-panel-at-end"
        content-class="xds:sliding-panel-fade-lg"
      />
    </template>
  </Wrapper>
</template>
<script setup lang="ts">
import Wrapper from '../wrapper.vue'
import SlidingPanel from './item.vue'

const rows = ['default', 'buttons', 'hover', 'fade', 'fade-size', 'combinations']
</script>
