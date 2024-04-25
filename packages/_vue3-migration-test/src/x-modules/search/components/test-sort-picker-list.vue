<template>
  <SortPickerList :items="sortValues">
    <template #default="{ item, isHighlighted, isSelected }">
      <span v-if="isSelected">✅</span>
      <span v-if="isHighlighted">🟢</span>
      {{ item }}
    </template>
  </SortPickerList>
</template>

<script setup lang="ts">
  // eslint-disable-next-line max-len
  import SortPickerList from '../../../../../x-components/src/x-modules/search/components/sort-picker-list.vue';

  const sortValues = ['Relevance', 'Price asc', 'Price desc'];
</script>
