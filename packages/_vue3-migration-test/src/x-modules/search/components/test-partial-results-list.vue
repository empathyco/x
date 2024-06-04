<template>
  <PartialResultsList>
    <template #default="{ partialResult }">
      <span data-test="partial-query">{{ partialResult.query }}</span>
      <BaseGrid #result="{ item }" :columns="4" :items="partialResult.results">
        {{ item.id }}
      </BaseGrid>
      <PartialQueryButton :query="partialResult.query">
        <template #default="{ query }">Ver todos {{ query }}</template>
      </PartialQueryButton>
    </template>
  </PartialResultsList>

  <div v-if="clickPartialQueryButton" class="text-content">
    <span>The user has clicked on a partial query button!!</span>
    <button @click="restartParialQueryButton" class="text-button">return</button>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import PartialQueryButton from '../../../../../x-components/src/x-modules/search/components/partial-query-button.vue';
  import BaseGrid from '../../../../../x-components/src/components/base-grid.vue';
  import PartialResultsList from '../../../../../x-components/src/x-modules/search/components/partial-results-list.vue';
  import { use$x } from '../../../../../x-components/src/composables/use-$x';

  const _x = use$x();

  const clickPartialQueryButton = ref(false);

  const restartParialQueryButton = () => (clickPartialQueryButton.value = false);

  _x.on('UserClickedPartialQuery', false).subscribe(() => (clickPartialQueryButton.value = true));
</script>

<style>
  .x-partial-results-list {
    gap: 12px;
  }

  .text-content {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .text-button {
    max-width: fit-content;
  }
</style>
