<template>
  <div>
    <h2>Simple Filter</h2>
    <SimpleFilter :filter="filter" />
  </div>
</template>

<script setup lang="ts">
  import { SimpleFilter as SimpleFilterModel } from '@empathyco/x-types';
  import { ref, Ref } from 'vue';
  import SimpleFilter from '../../../../../x-components/src/x-modules/facets/components/filters/simple-filter.vue';

  const filter: Ref<SimpleFilterModel> = ref({
    modelName: 'SimpleFilter',
    label: 'My Filter',
    totalResults: 10,
    facetId: 'facet1',
    id: 'filter1',
    selected: false
  });
</script>
