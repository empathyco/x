<template>
  <BaseColumnPickerDropdown v-model="selectedColumns" :columns="columns">
    <template #toggle="{ item, isOpen }">Selected: {{ item }} {{ isOpen ? '🔼' : '🔽' }}️</template>
    <template #item="{ item, isSelected, isHighlighted }">
      <span v-if="isHighlighted">🟢</span>
      <span v-if="isSelected">✅</span>
      <span>{{ item }}</span>
    </template>
  </BaseColumnPickerDropdown>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import BaseColumnPickerDropdown from '../../../../x-components/src/components/column-picker/base-column-picker-dropdown.vue';

  const columns = ref([2, 4, 6]);
  const selectedColumns = ref(4);
</script>
