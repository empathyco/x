<template>
  <div>
    <h2>Facets</h2>
    <Facets :renderableFacets="facetsIds.join(',')">
      <template #default="{ facet }">
        <h3>{{ facet.label }}</h3>
        <ul>
          <li v-for="filter in facet.filters" :key="filter.id">
            <BaseEventButton :events="{ UserClickedAFilter: filter }">
              {{ filter.label }}
              <span v-if="filter.selected">✅</span>
            </BaseEventButton>
          </li>
        </ul>
      </template>
    </Facets>
    <h2>SelectedFilters</h2>
    <SelectedFilters :facetsIds="facetsIds" alwaysVisible>
      <template #default="{ selectedFilters }">
        Selected filters: {{ selectedFilters.length }}
      </template>
    </SelectedFilters>
    <h2>SelectedFiltersList</h2>
    <SelectedFiltersList :facetsIds="facetsIds" alwaysVisible>
      <template #default="{ filter }">{{ filter.facetId }}: {{ filter.label }}</template>
    </SelectedFiltersList>
    <h2>ClearFilters</h2>
    <ClearFilters :facetsIds="facetsIds" alwaysVisible>
      <template #default="{ selectedFilters }">
        Clear filters ({{ selectedFilters.length }} selected)
      </template>
    </ClearFilters>
  </div>
</template>

<script setup lang="ts">
  import BaseEventButton from '../../../../../x-components/src/components/base-event-button.vue';
  import ClearFilters from '../../../../../x-components/src/x-modules/facets/components/clear-filters.vue';
  import Facets from '../../../../../x-components/src/x-modules/facets/components/facets/facets.vue';
  import SelectedFilters from '../../../../../x-components/src/x-modules/facets/components/lists/selected-filters.vue';
  import SelectedFiltersList from '../../../../../x-components/src/x-modules/facets/components/lists/selected-filters-list.vue';

  const facetsIds = ['gender', 'brand'];
</script>
