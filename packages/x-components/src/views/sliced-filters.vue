<template>
  <main>
    <h1>Test controls</h1>
    <ul class="x-test-controls">
      <li class="x-test-controls__control">
        <label>
          <input
            v-model="controls.slicedFilters.max"
            type="number"
            data-test="sliced-filters-max"
          />
          sliced-filters - max
        </label>
      </li>
    </ul>
    <!-- Search Section -->
    <SearchInput placeholder="Search" aria-label="Search for products" />
    <ClearSearchInput aria-label="Clear query">Clear</ClearSearchInput>
    <SearchButton aria-label="Search"><SearchIcon /></SearchButton>
    <!-- Facets -->
    <h1>Facets</h1>
    <ClearFilters v-slot="{ selectedFilters }" :alwaysVisible="true">
      Clear {{ selectedFilters.length }} filters
    </ClearFilters>
    <Facets>
      <template #default="{ facet }">
        <BaseHeaderTogglePanel>
          <template #header-content>{{ facet.label }}</template>
          <span>Total Filters:</span>
          <span data-test="total-filters">{{ facet.filters.length }}</span>
          <SlicedFilters :filters="facet.filters" :max="controls.slicedFilters.max">
            <template v-slot="{ slicedFilters }">
              <span>Sliced Filters:</span>
              <span data-test="sliced-filters">{{ slicedFilters.length }}</span>
              <MultiSelectFilters v-slot="{ filter }" :filters="slicedFilters">
                <SimpleFilter :filter="filter" data-test="simple-filter">
                  {{ filter.label }}
                </SimpleFilter>
              </MultiSelectFilters>
            </template>
          </SlicedFilters>
        </BaseHeaderTogglePanel>
      </template>
      <template #hierarchical_category="{ facet }">
        <BaseHeaderTogglePanel>
          <template #header-content>{{ facet.label }}</template>
          <span>Total Filters:</span>
          <span data-test="total-filters">{{ facet.filters.length }}</span>
          <SlicedFilters :filters="facet.filters" :max="controls.slicedFilters.max">
            <template v-slot="{ slicedFilters }">
              <span>Sliced Filters:</span>
              <span data-test="sliced-filters">{{ slicedFilters.length }}</span>
              <Filters v-slot="{ filter }">
                <HierarchicalFilter :filter="filter">
                  {{ filter.label }}
                </HierarchicalFilter>
              </Filters>
            </template>
          </SlicedFilters>
        </BaseHeaderTogglePanel>
      </template>
      <template #brand_facet="{ facet }">
        <BaseHeaderTogglePanel>
          <template #header-content>{{ facet.label }}</template>
          <span>Total Filters:</span>
          <span data-test="total-filters">{{ facet.filters.length }}</span>
          <SlicedFilters :filters="facet.filters" :max="controls.slicedFilters.max">
            <template v-slot="{ slicedFilters }">
              <span>Sliced Filters:</span>
              <span data-test="sliced-filters">{{ slicedFilters.length }}</span>
              <Filters v-slot="{ filter }">
                <SimpleFilter :filter="filter">
                  {{ filter.label }}
                </SimpleFilter>
              </Filters>
            </template>
          </SlicedFilters>
        </BaseHeaderTogglePanel>
      </template>
      <template #price_facet="{ facet }">
        <BaseHeaderTogglePanel>
          <template #header-content>{{ facet.label }}</template>
          <span>Total Filters:</span>
          <span data-test="total-filters">{{ facet.filters.length }}</span>
          <SlicedFilters :filters="facet.filters" :max="controls.slicedFilters.max">
            <template v-slot="{ slicedFilters }">
              <span>Sliced Filters:</span>
              <span data-test="sliced-filters">{{ slicedFilters.length }}</span>
              <Filters v-slot="{ filter }">
                <NumberRangeFilter :filter="filter">
                  <template #default="{ filter }">
                    <BasePriceFilterLabel
                      :filter="filter"
                      format="i €"
                      lessThan="Less than {max}"
                      fromTo="From {min} to {max}"
                      from="More than {min}"
                    />
                    {{ filter.label }} >
                  </template>
                </NumberRangeFilter>
              </Filters>
            </template>
          </SlicedFilters>
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
  import Facets from '../x-modules/facets/components/facets.vue';
  import AllFilter from '../x-modules/facets/components/filters/all-filter.vue';
  import NumberRangeFilter from '../x-modules/facets/components/filters/number-range-filter.vue';
  // eslint-disable-next-line max-len
  import ExcludeFiltersWithNoResults from '../x-modules/facets/components/lists/exclude-filters-with-no-results.vue';
  import SimpleFilter from '../x-modules/facets/components/filters/simple-filter.vue';
  import FiltersSearch from '../x-modules/facets/components/lists/filters-search.vue';
  import Filters from '../x-modules/facets/components/lists/filters.vue';
  import SlicedFilters from '../x-modules/facets/components/lists/sliced-filters.vue';
  import MultiSelectFilters from '../x-modules/facets/components/lists/multi-select-filters.vue';
  import SelectedFiltersList from '../x-modules/facets/components/lists/selected-filters-list.vue';
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
      BasePriceFilterLabel,
      ClearFilters,
      ClearSearchInput,
      ExcludeFiltersWithNoResults,
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
      SearchIcon,
      SimpleFilter,
      SlicedFilters
    }
  })
  export default class Sliced extends Vue {
    protected controls = {
      slicedFilters: {
        max: 5
      }
    };
  }
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
