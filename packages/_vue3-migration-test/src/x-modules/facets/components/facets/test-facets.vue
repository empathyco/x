<template>
  <Facets renderableFacets="gender, brand">
    <template #default="{ facet }">
      <h1>{{ facet.label }}</h1>
      <ul>
        <li v-for="filter in facet.filters" :key="filter.id">
          {{ filter.label }}
        </li>
      </ul>
    </template>
  </Facets>
</template>

<script setup lang="ts">
  import Facets from '../../../../../../x-components/src/x-modules/facets/components/facets/facets.vue';
</script>
