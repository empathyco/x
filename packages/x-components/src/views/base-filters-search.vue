<template>
  <main>
    <!-- Search Section -->
    <SearchInput placeholder="Search" aria-label="Search for products" />
    <ClearSearchInput aria-label="Clear query">Clear</ClearSearchInput>
    <SearchButton aria-label="Search"></SearchButton>
    <!-- Facets -->
    <h1>Facets</h1>
    <SelectedFilters>
      <template #default="{ selectedFilters }">
        Filters selected: {{ selectedFilters.length }}
      </template>
    </SelectedFilters>

    <SelectedFiltersList>
      <template #default="{ filter }">Default: {{ filter.label }}</template>
      <template #brand_facet="{ filter }">Brand: {{ filter.label }}</template>
      <template #age_facet="{ filter }">Age: {{ filter.label }}</template>
      <template #price_facet="{ filter }">Price: {{ filter.label }}</template>
    </SelectedFiltersList>

    <ClearFilters v-slot="{ selectedFilters }" :alwaysVisible="true">
      Clear {{ selectedFilters.length }} filters
    </ClearFilters>
    <Facets>
      <template #default="{ facet }">
        <BaseHeaderTogglePanel>
          <template #header-content>{{ facet.label }}</template>
          <SelectedFilters :facetId="facet.id" />
          <AllFilter :facet="facet" />
          <MultiSelectFilters v-slot="{ filter }" :filters="facet.filters">
            <SimpleFilter :filter="filter" data-test="simple-filter" />
          </MultiSelectFilters>
        </BaseHeaderTogglePanel>
      </template>
      <template #hierarchical_category="{ facet }">
        <BaseHeaderTogglePanel>
          <template #header-content>{{ facet.label }}</template>
          <SelectedFilters :facetId="facet.id" />
          <AllFilter :facet="facet" />
          <Filters v-slot="{ filter }" :filters="facet.filters">
            <HierarchicalFilter :filter="filter" data-test="hierarchical-filter" />
          </Filters>
        </BaseHeaderTogglePanel>
      </template>
      <template #brand_facet="{ facet }">
        <BaseHeaderTogglePanel>
          <template #header-content>{{ facet.label }}</template>
          <SelectedFilters :facetId="facet.id" />
          <FiltersSearch v-slot="{ siftedFilters }" :filters="facet.filters">
            <SlicedFilters :filters="siftedFilters" :max="8">
              <template #default="{ slicedFilters }">
                <Filters v-slot="{ filter }" :filters="slicedFilters">
                  <SimpleFilter :filter="filter" data-test="brand-filter" />
                </Filters>
              </template>
              <template #show-more="{ difference }">Show {{ difference }} more filters</template>
              <template #show-less="{ difference }">Show {{ difference }} less filters</template>
            </SlicedFilters>
          </FiltersSearch>
        </BaseHeaderTogglePanel>
      </template>
      <template #price_facet="{ facet }">
        <BaseHeaderTogglePanel>
          <template #header-content>{{ facet.label }}</template>
          <SelectedFilters :facetId="facet.id" />
          <AllFilter :facet="facet" />
          <Filters v-slot="{ filter }" :filters="facet.filters">
            <NumberRangeFilter :filter="filter" data-test="price-filter">
              <template #default="{ filter }">
                <BasePriceFilterTitle
                  :filter="filter"
                  :configCurrency="{ format: 'i €' }"
                  lessThan="Less than {max}"
                  fromTo="From {min} to {max}"
                  from="More than {min}"
                />
              </template>
            </NumberRangeFilter>
          </Filters>
        </BaseHeaderTogglePanel>
      </template>
    </Facets>
  </main>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import BasePriceFilterTitle from '../components/filters/labels/base-price-filter-label.vue';
  import BaseHeaderTogglePanel from '../components/panels/base-header-toggle-panel.vue';
  import { XPlugin } from '../plugins/x-plugin';
  import { XInstaller } from '../x-installer/x-installer';
  import HierarchicalFilter from '../x-modules/facets/components//filters/hierarchical-filter.vue';
  import ClearFilters from '../x-modules/facets/components/clear-filters.vue';
  import Facets from '../x-modules/facets/components/facets.vue';
  import AllFilter from '../x-modules/facets/components/filters/all-filter.vue';
  import NumberRangeFilter from '../x-modules/facets/components/filters/number-range-filter.vue';
  import SimpleFilter from '../x-modules/facets/components/filters/simple-filter.vue';
  import FiltersSearch from '../x-modules/facets/components/lists/filters-search.vue';
  import Filters from '../x-modules/facets/components/lists/filters.vue';
  import SlicedFilters from '../x-modules/facets/components/lists/sliced-filters.vue';
  import MultiSelectFilters from '../x-modules/facets/components/multi-select-filters.vue';
  import SelectedFiltersList from '../x-modules/facets/components/selected-filters-list.vue';
  import SelectedFilters from '../x-modules/facets/components/selected-filters.vue';
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
      BasePriceFilterTitle,
      ClearFilters,
      ClearSearchInput,
      Facets,
      Filters,
      FiltersSearch,
      HierarchicalFilter,
      NumberRangeFilter,
      MultiSelectFilters,
      SearchButton,
      SearchInput,
      SelectedFilters,
      SelectedFiltersList,
      SimpleFilter,
      SlicedFilters
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
  .x-all-filter--selected {
    font-weight: bold;
  }

  .x-header-toggle-panel {
    &__header {
      margin-bottom: 10px;
      font-weight: bold;
    }
  }
</style>
