<template>
  <BaseDropdown v-model="value" :items="items">
    <template #toggle="{ item, isOpen }">{{ item }} {{ isOpen ? '🔼' : '🔽' }}️</template>
    <template #item="{ item, isSelected, isHighlighted }">
      <span v-if="isHighlighted">🟢</span>
      <span v-if="isSelected">✅</span>
      <span>{{ item }}</span>
    </template>
  </BaseDropdown>
</template>

<script setup lang="ts">
  import { Identifiable } from '@empathyco/x-types';
  import { ref } from 'vue';
  import BaseDropdown from '../../../x-components/src/components/base-dropdown.vue';

  type BaseDropdownItem = string | number | Identifiable;

  const items: Array<BaseDropdownItem> = ['a', 2, { id: '3' }];

  const value = ref<BaseDropdownItem>(items[0]);
</script>
