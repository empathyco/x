<template>
  <BaseSuggestions :suggestions="suggestions">
    <template #default="{ suggestion }">
      <span>{{ suggestion.query }}</span>
    </template>
  </BaseSuggestions>
</template>

<script setup>
  import BaseSuggestions from '../../../x-components/src/components/suggestions/base-suggestions.vue';

  const suggestions = [
    {
      facets: [],
      key: 'chips',
      query: 'Chips',
      totalResults: 10,
      results: [],
      modelName: 'PopularSearch'
    },
    {
      facets: [],
      key: 'apples',
      query: 'Apples',
      totalResults: 5,
      results: [],
      modelName: 'PopularSearch'
    }
  ];
</script>

<style scoped></style>
