<template>
  <main>
    <!-- Search Section -->
    <SearchInput placeholder="Search" aria-label="Search for products" />
    <ClearSearchInput aria-label="Clear query">Clear</ClearSearchInput>
    <SearchButton aria-label="Search"></SearchButton>
    <!-- Facets -->
    <h1>Facets</h1>
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
            <SimpleFilter :filter="filter" :data-test="facet.id">
              <template #label="{ filter }">
                {{ filter.label }}
                <span data-test="filter-total-results">{{ filter.totalResults }}</span>
              </template>
            </SimpleFilter>
          </MultiSelectFilters>
        </BaseHeaderTogglePanel>
      </template>
      <template #hierarchical_category="{ facet }">
        <BaseHeaderTogglePanel>
          <template #header-content>{{ facet.label }}</template>
          <SelectedFilters :facetId="facet.id" />
          <AllFilter :facet="facet" />
          <MultiSelectFilters
            v-slot="// eslint-disable-next-line vue/no-unused-vars
            { filter }"
            :filters="facet.filters"
          >
            <HierarchicalFilter
              v-slot="{ isDisabled, filter, cssClasses, clickFilter }"
              :filter="filter"
            >
              <button
                @click="clickFilter"
                :aria-checked="filter.selected.toString()"
                :class="cssClasses"
                :disabled="isDisabled"
                :data-test="facet.id"
                role="checkbox"
              >
                {{ filter.label }}
                <!--
                  @slot The content to render inside the button.
                     @binding {Filter} filter - The filter data.
                -->
                <span data-test="filter-total-results">{{ filter.totalResults }}</span>
              </button>
            </HierarchicalFilter>
          </MultiSelectFilters>
        </BaseHeaderTogglePanel>
      </template>
      <template #brand_facet="{ facet }">
        <BaseHeaderTogglePanel>
          <template #header-content>{{ facet.label }}</template>
          <SelectedFilters :facetId="facet.id" />
          <FiltersSearch :filters="facet.filters">
            <MultiSelectFilters v-slot="{ filter }">
              <SimpleFilter v-slot="{ filter: slotFilter, clickFilter }" :filter="filter">
                <label :data-test="facet.id">
                  <input @change="clickFilter" type="checkbox" :checked="filter.selected" />
                  {{ slotFilter.label }}
                  <span data-test="filter-total-results">{{ filter.totalResults }}</span>
                </label>
              </SimpleFilter>
            </MultiSelectFilters>
            <template #show-more="{ difference }">Show {{ difference }} more filters</template>
            <template #show-less="{ difference }">Show {{ difference }} less filters</template>
          </FiltersSearch>
        </BaseHeaderTogglePanel>
      </template>
      <template #price_facet="{ facet }">
        <BaseHeaderTogglePanel>
          <template #header-content>{{ facet.label }}</template>
          <SelectedFilters :facetId="facet.id" />
          <AllFilter :facet="facet" />
          <MultiSelectFilters v-slot="{ filter }" :filters="facet.filters">
            <NumberRangeFilter :filter="filter" :data-test="facet.id">
              <template #default="{ filter }">
                <BasePriceFilterLabel
                  :filter="filter"
                  format="i € "
                  lessThan="Less than {max}"
                  fromTo="From {min} to {max}"
                  from="More than {min}"
                />
                <span data-test="filter-total-results">{{ filter.totalResults }}</span>
              </template>
            </NumberRangeFilter>
          </MultiSelectFilters>
        </BaseHeaderTogglePanel>
      </template>
    </Facets>
    <!-- Results -->
    <h1>
      Results
      <span data-test="stored-results">{{ results.length }}</span>
      /
      <span data-test="total-results">{{ $x.totalResults }}</span>
    </h1>
  </main>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import { Result } from '@empathy/search-types';
  import BasePriceFilterLabel from '../components/filters/labels/base-price-filter-label.vue';
  import AllFilter from '../x-modules/facets/components/filters/all-filter.vue';
  import FiltersSearch from '../x-modules/facets/components/lists/filters-search.vue';
  import BaseHeaderTogglePanel from '../components/panels/base-header-toggle-panel.vue';
  import Filters from '../x-modules/facets/components/lists/filters.vue';
  import HierarchicalFilter from '../x-modules/facets/components/filters/hierarchical-filter.vue';
  import NumberRangeFilter from '../x-modules/facets/components/filters/number-range-filter.vue';
  import SimpleFilter from '../x-modules/facets/components/filters/simple-filter.vue';
  import ClearFilters from '../x-modules/facets/components/clear-filters.vue';
  import SelectedFilters from '../x-modules/facets/components/selected-filters.vue';
  import ClearSearchInput from '../x-modules/search-box/components/clear-search-input.vue';
  import Facets from '../x-modules/facets/components/facets.vue';
  import MultiSelectFilters from '../x-modules/facets/components/lists/multi-select-filters.vue';
  import SearchButton from '../x-modules/search-box/components/search-button.vue';
  import SearchInput from '../x-modules/search-box/components/search-input.vue';
  import { State } from '../components/decorators/store.decorators';
  import { searchXModule } from '../x-modules/search/x-module';
  import { XInstaller } from '../x-installer/x-installer';
  import { XPlugin } from '../plugins/x-plugin';
  import { baseInstallXOptions, baseSnippetConfig } from './base-config';

  @Component({
    beforeRouteEnter(_to, _from, next: () => void): void {
      XPlugin.registerXModule(searchXModule);
      new XInstaller(baseInstallXOptions).init(baseSnippetConfig);
      next();
    },
    components: {
      AllFilter,
      ClearSearchInput,
      Filters,
      FiltersSearch,
      BaseHeaderTogglePanel,
      BasePriceFilterLabel,
      HierarchicalFilter,
      NumberRangeFilter,
      SimpleFilter,
      ClearFilters,
      Facets,
      MultiSelectFilters,
      SelectedFilters,
      SearchButton,
      SearchInput
    }
  })
  export default class MultiselectFilters extends Vue {
    @State('search', 'results')
    public results!: Result[];
  }
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
