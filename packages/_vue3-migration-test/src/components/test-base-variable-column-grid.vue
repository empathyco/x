<template>
  <button @click="setColumns" class="column-picker-selector">
    <span class="column-picker-selector__text">{{ columnsToRender }} columns</span>
  </button>
  <button @click="resetColumns" class="column-picker-reset">
    <span>reset columns</span>
  </button>
  <ResultsList>
    <BaseVariableColumnGrid :columns="columnsToRender">
      <template #result="{ item: result }">
        {{ result.id }}
      </template>
    </BaseVariableColumnGrid>
  </ResultsList>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import ResultsList from '../../../x-components/src/x-modules/search/components/results-list.vue';
  import BaseVariableColumnGrid from '../../../x-components/src/components/base-variable-column-grid.vue';
  const columnsToRender = ref(2);
  const setColumns = () => (columnsToRender.value = columnsToRender.value + 1);
  const resetColumns = () => (columnsToRender.value = 2);
</script>

<style>
  .column-picker-reset {
    margin-left: 4px;
  }
</style>
