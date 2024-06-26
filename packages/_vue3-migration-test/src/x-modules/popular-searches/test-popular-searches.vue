<template>
  <SearchInput />
  <ClearSearchInput />
  <div v-if="!query">
    <h1>Popular searches</h1>
    <PopularSearches />
  </div>
</template>

<script setup>
  import PopularSearches from '../../../../x-components/src/x-modules/popular-searches/components/popular-searches.vue';
  import SearchInput from '../../../../x-components/src/x-modules/search-box/components/search-input.vue';
  import ClearSearchInput from '../../../../x-components/src/x-modules/search-box/components/clear-search-input.vue';
  import { useState } from '../../../../x-components/src/composables/use-state';

  const { query } = useState('search', ['query']);
</script>

<style scoped>
  .x-popular-searches {
    width: fit-content;
  }
</style>
