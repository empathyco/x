<template>
  <SelectedFilters :facetsIds="['gender', 'brand']" alwaysVisible>
    <template #default="{ selectedFilters }">
      Selected filters: {{ selectedFilters.length }}
    </template>
  </SelectedFilters>
</template>

<script setup lang="ts">
  import SelectedFilters from '../../../../../../x-components/src/x-modules/facets/components/lists/selected-filters.vue';
</script>
