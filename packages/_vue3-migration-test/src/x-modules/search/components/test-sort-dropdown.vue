<template>
  <SortDropdown :items="sortValues">
    <template #toggle="{ item, isOpen }">{{ item }} {{ isOpen ? '🔼' : '🔽' }}</template>
    <template #item="{ item, isHighlighted, isSelected }">
      <span v-if="isSelected">✅</span>
      <span v-if="isHighlighted">🟢</span>
      {{ item }}
    </template>
  </SortDropdown>
</template>

<script setup lang="ts">
  // eslint-disable-next-line max-len
  import SortDropdown from '../../../../../x-components/src/x-modules/search/components/sort-dropdown.vue';

  const sortValues = ['Relevance', 'Price asc', 'Price desc'];
</script>
