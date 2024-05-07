<template>
  <SelectedFiltersList :facetsIds="['gender', 'brand']" alwaysVisible>
    <template #default="{ filter }">{{ filter.facetId }}: {{ filter.label }}</template>
  </SelectedFiltersList>
</template>

<script setup lang="ts">
  import SelectedFiltersList from '../../../../../../x-components/src/x-modules/facets/components/lists/selected-filters-list.vue';
</script>
