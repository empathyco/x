<template>
  <ul class="list">
    <DisplayEmitter
      v-for="item in items"
      :key="item.id"
      :payload="{
        url: 'tagging/url',
        params: { displayId: item.id, totalHits: item.index }
      }"
      :eventMetadata="semanticFeature"
    >
      <li>{{ item.id }}</li>
    </DisplayEmitter>
  </ul>
</template>

<script setup lang="ts">
  import DisplayEmitter from '../../../x-components/src/components/display-emitter.vue';
  import { useXBus } from '../../../x-components/src/composables/use-x-bus';
  import { DisplayWireMetadata } from '../../../x-components/src/wiring/wiring.types';

  const xBus = useXBus();

  const items = Array.from({ length: 50 }, (_, index) => ({ id: `item-${index}`, index }));
  const semanticFeature: Partial<DisplayWireMetadata> = {
    feature: 'semantics',
    displayOriginalQuery: 'mercedes',
    location: 'low_results'
  };

  /* eslint-disable no-console */
  xBus
    .on('TrackableElementDisplayed', true)
    .subscribe(args => console.log('TrackableElementDisplayed event ->', args));
  /* eslint-enable no-console */
</script>

<style>
  .list {
    height: 50px;
    overflow-y: auto;
  }
</style>
