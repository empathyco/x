<template>
  <!--
  <BaseColumnPickerList v-model="selectedColumns" :columns="columns">
    <template #default="{ column, isSelected }">
      <span v-if="isSelected">✅</span>
      <span>{{ column }}</span>
    </template>
    <template #divider>
      <span>-----</span>
    </template>
  </BaseColumnPickerList>
  -->
  <span>
    BREAKING Vue3: `template v-for` key should be placed on the `template` tag (rather than on its
    children)
  </span>
</template>

<script setup lang="ts">
  /*
  import { ref } from 'vue';
  import BaseColumnPickerList from '../../../../x-components/src/components/column-picker/base-column-picker-list.vue';

  const columns = ref([2, 4, 6]);
  const selectedColumns = ref(4);
  */
</script>
