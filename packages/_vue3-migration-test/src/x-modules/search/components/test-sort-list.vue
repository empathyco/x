<template>
  <SortList :items="sortValues">
    <template #default="{ item, isHighlighted, isSelected }">
      <span v-if="isSelected">✅</span>
      <span v-if="isHighlighted">🟢</span>
      {{ item }}
    </template>
  </SortList>
</template>

<script setup lang="ts">
  import SortList from '../../../../../x-components/src/x-modules/search/components/sort-list.vue';

  const sortValues = ['Relevance', 'Price asc', 'Price desc'];
</script>
