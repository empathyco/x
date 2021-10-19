<template>
  <main>
    <!-- Search Section -->
    <SearchInput placeholder="Search" aria-label="Search for products" />
    <ClearSearchInput aria-label="Clear query">Clear</ClearSearchInput>
    <SearchButton aria-label="Search"><SearchIcon /></SearchButton>
    <!-- Facets -->
    <h1>Facets</h1>
    <Facets renderable-facets="brand_facet">
      <template #brand-facet="{ facet }">
        <SlicedFilters :filters="facet.filters" :max="8">
          <template v-slot="{ slicedFilters }">
            <FiltersSearch :filters="slicedFilters" data-test="after-slice-filter-search">
              <template #default="{ siftedFilters }">
                <FiltersList v-slot="{ filter }" :filters="siftedFilters">
                  <SimpleFilter :filter="filter" data-test="brand-filter" />
                </FiltersList>
              </template>
            </FiltersSearch>
          </template>
        </SlicedFilters>
      </template>
    </Facets>
    <Facets renderable-facets="brand_facet">
      <template #brand-facet="{ facet }">
        <FiltersSearch
          v-slot="{ siftedFilters }"
          :filters="facet.filters"
          data-test="no-slice-filter-search"
        >
          <FiltersList v-slot="{ filter }" :filters="siftedFilters">
            <SimpleFilter :filter="filter" data-test="brand-filter" />
          </FiltersList>
        </FiltersSearch>
      </template>
    </Facets>
    <Facets renderable-facets="brand_facet">
      <template #brand-facet="{ facet }">
        <FiltersSearch
          v-slot="{ siftedFilters }"
          :filters="facet.filters"
          data-test="before-slice-filter-search"
        >
          <SlicedFilters :filters="siftedFilters" :max="8">
            <template #default="{ slicedFilters }">
              <FiltersList v-slot="{ filter }" :filters="slicedFilters">
                <SimpleFilter :filter="filter" data-test="brand-filter" />
              </FiltersList>
            </template>
          </SlicedFilters>
        </FiltersSearch>
      </template>
    </Facets>
  </main>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import { SearchIcon } from '../components/icons/index';
  import { XPlugin } from '../plugins/x-plugin';
  import { XInstaller } from '../x-installer/x-installer';
  import HierarchicalFilter from '../x-modules/facets/components//filters/hierarchical-filter.vue';
  import Facets from '../x-modules/facets/components/facets/facets.vue';
  import SimpleFilter from '../x-modules/facets/components/filters/simple-filter.vue';
  import FiltersSearch from '../x-modules/facets/components/lists/filters-search.vue';
  import FiltersList from '../x-modules/facets/components/lists/filters-list.vue';
  import SlicedFilters from '../x-modules/facets/components/lists/sliced-filters.vue';
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
      ClearSearchInput,
      Facets,
      FiltersList,
      FiltersSearch,
      HierarchicalFilter,
      SearchButton,
      SearchInput,
      SearchIcon,
      SimpleFilter,
      SlicedFilters
    }
  })
  export default class App extends Vue {}
</script>

<style lang="scss">
  .x-facets-list {
    display: inline-flex;
    flex-direction: column;
    width: 25%;
  }
</style>
