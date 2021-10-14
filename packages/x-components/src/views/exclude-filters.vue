<template>
  <main>
    <!-- Search Section -->
    <SearchInput placeholder="Search" aria-label="Search for products" />
    <ClearSearchInput aria-label="Clear query">Clear</ClearSearchInput>
    <SearchButton aria-label="Search"><SearchIcon /></SearchButton>
    <!-- Facets -->
    <h1>Facets</h1>
    <SelectedFilters>
      <template #default="{ selectedFilters }">
        Filters selected: {{ selectedFilters.length }}
      </template>
    </SelectedFilters>
    <SelectedFiltersList class="x-list--horizontal x-list--gap-02">
      <template #default="{ filter }">Default: {{ filter.label }}</template>
      <template #brand-facet="{ filter }">Brand: {{ filter.label }}</template>
      <template #age-facet="{ filter }">Age: {{ filter.label }}</template>
      <template #price-facet="{ filter }">Price: {{ filter.label }}</template>
    </SelectedFiltersList>
    <ClearFilters v-slot="{ selectedFilters }" :alwaysVisible="true">
      Clear {{ selectedFilters.length }} filters
    </ClearFilters>
    <Facets>
      <template #default="{ facet }">
        <BaseHeaderTogglePanel>
          <template #header-content>{{ facet.label }}</template>
          <span>Total Filters:</span>
          <span data-test="total-filters">{{ facet.filters.length }}</span>
          <SelectedFilters :facetId="facet.id" />
          <ExcludeFiltersWithNoResults v-slot="{ filters }" :filters="facet.filters">
            <FiltersList v-slot="{ filter }" :filters="filters">
              <SimpleFilter :filter="filter" data-test="simple-filter">
                {{ filter.label }}
                <span data-test="filter-total-results">{{ filter.totalResults }}</span>
              </SimpleFilter>
            </FiltersList>
          </ExcludeFiltersWithNoResults>
        </BaseHeaderTogglePanel>
      </template>
      <template #hierarchical-category="{ facet }">
        <BaseHeaderTogglePanel>
          <template #header-content>{{ facet.label }}</template>
          <span>Total Filters:</span>
          <span data-test="total-filters">{{ facet.filters.length }}</span>
          <SelectedFilters :facetId="facet.id" />
          <ExcludeFiltersWithNoResults v-slot="{ filters }" :filters="facet.filters">
            <FiltersList v-slot="{ filter }" :filters="filters">
              <HierarchicalFilter :filter="filter" data-test="hierarchical-filter">
                {{ filter.label }}
                <span data-test="filter-total-results">{{ filter.totalResults }}</span>
              </HierarchicalFilter>
            </FiltersList>
          </ExcludeFiltersWithNoResults>
        </BaseHeaderTogglePanel>
      </template>
      <template #brand-facet="{ facet }">
        <BaseHeaderTogglePanel>
          <template #header-content>{{ facet.label }}</template>
          <span>Total Filters:</span>
          <span data-test="total-filters">{{ facet.filters.length }}</span>
          <SelectedFilters :facetId="facet.id" />
          <FiltersSearch v-slot="{ siftedFilters }" :filters="facet.filters">
            <ExcludeFiltersWithNoResults v-slot="{ filters }" :filters="siftedFilters">
              <SlicedFilters :filters="filters" :max="8">
                <template #default="{ slicedFilters }">
                  <FiltersList v-slot="{ filter }" :filters="slicedFilters">
                    <SimpleFilter :filter="filter" data-test="brand-filter">
                      {{ filter.label }}
                      <span data-test="filter-total-results">{{ filter.totalResults }}</span>
                    </SimpleFilter>
                  </FiltersList>
                </template>
                <template #show-more="{ difference }">Show {{ difference }} more filters</template>
                <template #show-less="{ difference }">Show {{ difference }} less filters</template>
              </SlicedFilters>
            </ExcludeFiltersWithNoResults>
          </FiltersSearch>
        </BaseHeaderTogglePanel>
      </template>
      <template #price-facet="{ facet }">
        <BaseHeaderTogglePanel>
          <template #header-content>{{ facet.label }}</template>
          <span>Total Filters:</span>
          <span data-test="price-total-filters">{{ facet.filters.length }}</span>
          <SelectedFilters :facetId="facet.id" />
          <ExcludeFiltersWithNoResults v-slot="{ filters }" :filters="facet.filters">
            <FiltersList v-slot="{ filter }" :filters="filters">
              <NumberRangeFilter :filter="filter" data-test="price-filter">
                <template #default="{ filter }">
                  <BasePriceFilterLabel
                    :filter="filter"
                    format="i €"
                    lessThan="Less than {max}"
                    fromTo="From {min} to {max}"
                    from="More than {min}"
                  />
                  {{ filter.label }}
                  <span data-test="filter-total-results">{{ filter.totalResults }}</span>
                </template>
              </NumberRangeFilter>
            </FiltersList>
          </ExcludeFiltersWithNoResults>
        </BaseHeaderTogglePanel>
      </template>
    </Facets>
  </main>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import BasePriceFilterLabel from '../components/filters/labels/base-price-filter-label.vue';
  import { SearchIcon } from '../components/icons/index';
  import BaseHeaderTogglePanel from '../components/panels/base-header-toggle-panel.vue';
  import { XPlugin } from '../plugins/x-plugin';
  import { XInstaller } from '../x-installer/x-installer';
  import HierarchicalFilter from '../x-modules/facets/components//filters/hierarchical-filter.vue';
  import ClearFilters from '../x-modules/facets/components/clear-filters.vue';
  import Facets from '../x-modules/facets/components/facets/facets.vue';
  import AllFilter from '../x-modules/facets/components/filters/all-filter.vue';
  import NumberRangeFilter from '../x-modules/facets/components/filters/number-range-filter.vue';
  // eslint-disable-next-line max-len
  import ExcludeFiltersWithNoResults from '../x-modules/facets/components/lists/exclude-filters-with-no-results.vue';
  import SimpleFilter from '../x-modules/facets/components/filters/simple-filter.vue';
  import FiltersSearch from '../x-modules/facets/components/lists/filters-search.vue';
  import FiltersList from '../x-modules/facets/components/lists/filters-list.vue';
  import SlicedFilters from '../x-modules/facets/components/lists/sliced-filters.vue';
  import SelectedFiltersList from '../x-modules/facets/components/lists/selected-filters-list.vue';
  import SelectedFilters from '../x-modules/facets/components/lists/selected-filters.vue';
  import ClearSearchInput from '../x-modules/search-box/components/clear-search-input.vue';
  import SearchButton from '../x-modules/search-box/components/search-button.vue';
  import SearchInput from '../x-modules/search-box/components/search-input.vue';
  import { searchXModule } from '../x-modules/search/x-module';
  import { baseInstallXOptions, baseSnippetConfig } from './base-config';

  @Component({
    beforeRouteEnter(_to, _from, next: () => void): void {
      XPlugin.registerXModule(searchXModule);
      new XInstaller(baseInstallXOptions).init(baseSnippetConfig);
      next();
    },

    components: {
      AllFilter,
      BaseHeaderTogglePanel,
      BasePriceFilterLabel,
      ClearFilters,
      ClearSearchInput,
      ExcludeFiltersWithNoResults,
      Facets,
      FiltersList,
      FiltersSearch,
      HierarchicalFilter,
      NumberRangeFilter,
      SearchButton,
      SearchInput,
      SelectedFilters,
      SelectedFiltersList,
      SimpleFilter,
      SlicedFilters,
      SearchIcon
    }
  })
  export default class App extends Vue {}
</script>

<style lang="scss">
  .x-facets-list {
    display: flex;
    flex-flow: row;
  }

  .x-filter--is-selected,
  .x-all-filter--is-selected {
    font-weight: bold;
  }

  .x-header-toggle-panel {
    &__header {
      margin-bottom: 10px;
      font-weight: bold;
    }
  }
</style>
