<template>
  <div>
    <SearchInput />
    <ClearSearchInput />
    <SearchButton>Search</SearchButton>
    <SearchInputPlaceholder :messages="placeholderMessages" animation="div" />
  </div>
</template>

<script setup lang="ts">
  import SearchInput from '../../../../../x-components/src/x-modules/search-box/components/search-input.vue';
  import SearchInputPlaceholder from '../../../../../x-components/src/x-modules/search-box/components/search-input-placeholder.vue';
  import SearchButton from '../../../../../x-components/src/x-modules/search-box/components/search-button.vue';
  import ClearSearchInput from '../../../../../x-components/src/x-modules/search-box/components/clear-search-input.vue';

  const placeholderMessages = [
    'Find shirts',
    'Find shoes',
    'Find watches',
    'Find handbags',
    'Find sunglasses'
  ];
</script>

<style scoped></style>
