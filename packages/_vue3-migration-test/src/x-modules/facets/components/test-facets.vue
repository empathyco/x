<template>
  <div>
    <h2>Facets</h2>
    <Facets :renderableFacets="facetsIds.join(',')">
      <template #default="{ facet }">
        <h3>{{ facet.label }}</h3>
        <ExcludeFiltersWithNoResults :filters="facet.filters">
          <SortedFilters>
            <FiltersSearch :data-test="`filters-search-${facet.id}`">
              <SlicedFilters :max="4" :data-test="`${facet.label}-sliced-filters`">
                <AllFilter
                  v-slot="{ isSelected }"
                  :facet="facet"
                  class="x-facet-filter-lg x-mb-8 x-w-full"
                >
                  <label :for="facet.id">
                    <input :id="facet.id" type="checkbox" :checked="isSelected" />
                    All
                  </label>
                </AllFilter>
                <FiltersList
                  v-slot="{
                    // eslint-disable-next-line vue/no-unused-vars
                    filter
                  }"
                >
                  <BaseEventButton :events="{ UserClickedAFilter: filter }">
                    {{ filter.label }}
                    {{ filter.totalResults }}
                    <span v-if="filter.selected">✅</span>
                  </BaseEventButton>
                </FiltersList>
              </SlicedFilters>
            </FiltersSearch>
          </SortedFilters>
        </ExcludeFiltersWithNoResults>
      </template>
    </Facets>
    <h2>SelectedFilters</h2>
    <SelectedFilters
      class="it-is-a-inheritance-class"
      :facetsIds="facetsIds"
      #default="{ selectedFilters }"
    >
      <span>Selected filters: {{ selectedFilters.length }}</span>
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
  import SortedFilters from '../../../../../x-components/src/x-modules/facets/components/lists/sorted-filters.vue';
  import SlicedFilters from '../../../../../x-components/src/x-modules/facets/components/lists/sliced-filters.vue';
  import FiltersSearch from '../../../../../x-components/src/x-modules/facets/components/lists/filters-search.vue';
  import ExcludeFiltersWithNoResults from '../../../../../x-components/src/x-modules/facets/components/lists/exclude-filters-with-no-results.vue';
  import FiltersList from '../../../../../x-components/src/x-modules/facets/components/lists/filters-list.vue';
  import AllFilter from '../../../../../x-components/src/x-modules/facets/components/filters/all-filter.vue';

  const facetsIds = ['gender', 'brand', 'category'];
</script>
