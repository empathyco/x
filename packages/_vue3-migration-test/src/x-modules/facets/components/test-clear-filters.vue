<template>
  <ClearFilters :facetsIds="['gender', 'brand']" alwaysVisible>
    <template #default="{ selectedFilters }">
      Clear filters ({{ selectedFilters.length }} selected)
    </template>
  </ClearFilters>
</template>

<script setup lang="ts">
  import ClearFilters from '../../../../../x-components/src/x-modules/facets/components/clear-filters.vue';
</script>
