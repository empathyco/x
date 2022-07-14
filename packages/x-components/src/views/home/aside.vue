<template>
  <div
    class="
      x-list x-list--padding-05 x-list--padding-top x-list--gap-06 x-list--border x-list--border-top
    "
  >
    <FacetsProvider :facets="staticFacets" />
    <ClearFilters />
    <SelectedFiltersList>
      <template #default="{ filter }">
        <SimpleFilter :filter="filter" class="x-tag" />
      </template>
    </SelectedFiltersList>

    <!-- Facets -->
    <Facets class="x-list--gap-06">
      <!--  Hierarchical Facet    -->
      <template #hierarchical-facet="{ facet }">
        <BaseHeaderTogglePanel class="x-facet">
          <template #header-content>
            <span class="x-ellipsis">{{ facet.label }}</span>
            <ChevronDown />
          </template>
          <!-- Filters -->
          <SlicedFilters max="4" :filters="facet.filters">
            <FiltersList v-slot="{ filter }">
              <HierarchicalFilter :filter="filter" :data-test="`${facet.label}-filter`" />
            </FiltersList>
          </SlicedFilters>
        </BaseHeaderTogglePanel>
      </template>

      <!--  Range Facet    -->
      <template #number-range-facet="{ facet }">
        <BaseHeaderTogglePanel class="x-facet">
          <template #header-content>
            <span :data-test="facet.label" class="x-ellipsis">{{ facet.label }}</span>
            <ChevronDown />
          </template>
          <!-- Filters -->
          <ExcludeFiltersWithNoResults :filters="facet.filters">
            <SortedFilters>
              <SlicedFilters
                :max="controls.slicedFilters.max"
                :data-test="`${facet.label}-sliced-filters`"
              >
                <SelectedFilters #default="{ selectedFilters }" :facetsIds="[facet.id]">
                  <span :data-test="`${facet.label}-selected-filters`">
                    {{ selectedFilters.length }}
                  </span>
                </SelectedFilters>
                <FiltersList v-slot="{ filter }">
                  <SimpleFilter #label :filter="filter" :data-test="`${facet.label}-filter`">
                    <BasePriceFilterLabel
                      v-if="facet.id === 'price'"
                      :filter="filter"
                      class="x-filter__label"
                      format="ii.dd €"
                      lessThan="Less than {max}"
                      fromTo="From {min} to {max}"
                      from="More than {min}"
                    />
                  </SimpleFilter>
                </FiltersList>
              </SlicedFilters>
            </SortedFilters>
          </ExcludeFiltersWithNoResults>
        </BaseHeaderTogglePanel>
      </template>

      <!--  Default Facet    -->
      <template #default="{ facet }">
        <BaseHeaderTogglePanel class="x-facet">
          <template #header-content>
            <span :data-test="facet.label" class="x-ellipsis">{{ facet.label }}</span>
            <span data-test="total-filters">{{ facet.filters.length }}</span>
            <ChevronDown />
          </template>

          <!-- Filters -->
          <ExcludeFiltersWithNoResults :filters="facet.filters">
            <SortedFilters>
              <FiltersSearch :data-test="`filters-search-${facet.id}`">
                <SlicedFilters
                  :max="controls.slicedFilters.max"
                  :data-test="`${facet.label}-sliced-filters`"
                >
                  <FiltersList
                    v-slot="{
                      // eslint-disable-next-line vue/no-unused-vars
                      filter
                    }"
                  >
                    <SimpleFilter
                      #label="{ filter }"
                      :filter="filter"
                      :data-test="`${facet.label}-filter`"
                    >
                      {{ filter.label }}
                      <span :data-test="`${facet.label}-filter-total-results`">
                        {{ filter.totalResults }}
                      </span>
                    </SimpleFilter>
                  </FiltersList>
                </SlicedFilters>
              </FiltersSearch>
            </SortedFilters>
          </ExcludeFiltersWithNoResults>
        </BaseHeaderTogglePanel>
      </template>
    </Facets>
  </div>
</template>

<script lang="ts">
  import { Facet, SimpleFilter as SimpleFilterModel } from '@empathyco/x-types';
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import { XInject } from '../../components';
  import BasePriceFilterLabel from '../../components/filters/labels/base-price-filter-label.vue';
  import ChevronDown from '../../components/icons/chevron-down.vue';
  import BaseHeaderTogglePanel from '../../components/panels/base-header-toggle-panel.vue';
  import ClearFilters from '../../x-modules/facets/components/clear-filters.vue';
  import FacetsProvider from '../../x-modules/facets/components/facets/facets-provider.vue';
  import Facets from '../../x-modules/facets/components/facets/facets.vue';
  // eslint-disable-next-line max-len
  import HierarchicalFilter from '../../x-modules/facets/components/filters/hierarchical-filter.vue';
  import SimpleFilter from '../../x-modules/facets/components/filters/simple-filter.vue';
  // eslint-disable-next-line max-len
  import ExcludeFiltersWithNoResults from '../../x-modules/facets/components/lists/exclude-filters-with-no-results.vue';
  import FiltersList from '../../x-modules/facets/components/lists/filters-list.vue';
  import FiltersSearch from '../../x-modules/facets/components/lists/filters-search.vue';
  // eslint-disable-next-line max-len
  import SelectedFiltersList from '../../x-modules/facets/components/lists/selected-filters-list.vue';
  import SelectedFilters from '../../x-modules/facets/components/lists/selected-filters.vue';
  import SlicedFilters from '../../x-modules/facets/components/lists/sliced-filters.vue';
  import SortedFilters from '../../x-modules/facets/components/lists/sorted-filters.vue';
  import { HomeControls } from './types';

  @Component({
    components: {
      BaseHeaderTogglePanel,
      BasePriceFilterLabel,
      ChevronDown,
      ClearFilters,
      ExcludeFiltersWithNoResults,
      Facets,
      FacetsProvider,
      FiltersList,
      FiltersSearch,
      HierarchicalFilter,
      SimpleFilter,
      SelectedFilters,
      SelectedFiltersList,
      SlicedFilters,
      SortedFilters
    }
  })
  export default class Aside extends Vue {
    @XInject('controls')
    public controls!: HomeControls;

    protected staticFacets: Facet[] = [
      {
        modelName: 'SimpleFacet',
        label: 'offer',
        id: 'offer',
        filters: [
          {
            facetId: 'offer',
            modelName: 'SimpleFilter',
            id: 'price:[0 TO 10]',
            selected: false,
            label: 'In Offer'
          } as SimpleFilterModel
        ]
      }
    ];
  }
</script>

<style scoped lang="scss"></style>
