<script setup lang="ts">
  import FiltersSearch from '../../../../../x-components/src/x-modules/facets/components/lists/filters-search.vue';
  import SlicedFilters from '../../../../../x-components/src/x-modules/facets/components/lists/sliced-filters.vue';
  import SortedFilters from '../../../../../x-components/src/x-modules/facets/components/lists/sorted-filters.vue';
  import ExcludeFiltersWithNoResults from '../../../../../x-components/src/x-modules/facets/components/lists/exclude-filters-with-no-results.vue';
  import FiltersList from '../../../../../x-components/src/x-modules/facets/components/lists/filters-list.vue';
  import { useState } from '../../../../../x-components/src/composables/use-state';
  import { useRegisterXModule } from '../../../../../x-components/src/composables/use-register-x-module';
  import { facetsXModule } from '../../../../../x-components/src/x-modules/facets/x-module';

  useRegisterXModule(facetsXModule);

  const facet = useState('facets', ['facets']).facets.value['category'];
</script>

<template>
  <div>
    <ExcludeFiltersWithNoResults :filters="facet.filters">
      <SortedFilters>
        <FiltersSearch :data-test="`filters-search-${facet.id}`">
          <SlicedFilters :max="4" :data-test="`${facet.label}-sliced-filters`">
            <FiltersList
              v-slot="{
                // eslint-disable-next-line vue/no-unused-vars
                filter
              }"
            >
              {{ filter.label }}
              {{ filter.totalResults }}
            </FiltersList>
          </SlicedFilters>
        </FiltersSearch>
      </SortedFilters>
    </ExcludeFiltersWithNoResults>
  </div>
</template>

<style scoped lang="scss">
  .list {
    overflow: auto;
    height: 100px;
  }
</style>
