<template>
  <SearchInput :maxLength="10" />
  <ClearSearchInput />

  <HistoryQueries :maxItemsToRender="5" />
  <ClearHistoryQueries class="x-button--ghost x-button--ghost-start">
    <span>Clear previous searches</span>
  </ClearHistoryQueries>
</template>

<script setup>
  import HistoryQueries from '../../../../../x-components/src/x-modules/history-queries/components/history-queries.vue';
  import ClearHistoryQueries from '../../../../../x-components/src/x-modules/history-queries/components/clear-history-queries.vue';
  import ClearSearchInput from '../../../../../x-components/src/x-modules/search-box/components/clear-search-input.vue';
  import SearchInput from '../../../../../x-components/src/x-modules/search-box/components/search-input.vue';
</script>
