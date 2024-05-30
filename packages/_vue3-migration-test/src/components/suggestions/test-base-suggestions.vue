<template>
  <BaseSuggestions :suggestions="suggestions">
    <template #default="{ suggestion }">
      <span>{{ suggestion.query }}</span>
    </template>
  </BaseSuggestions>
</template>

<script setup>
  import BaseSuggestions from '../../../../x-components/src/components/suggestions/base-suggestions.vue';
  import { getQuerySuggestionsStub } from '../../../../x-components/src/__stubs__';

  const suggestions = getQuerySuggestionsStub('chip', 5);
</script>

<style scoped></style>
