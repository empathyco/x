<template>
  <main>
    <BaseKeyboardNavigation>
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
            <BaseAllFilter :facet="facet" />
            <MultiSelectFilters v-slot="{ filter }" :filters="facet.filters">
              <BaseSimpleFilter :filter="filter" />
            </MultiSelectFilters>
          </BaseHeaderTogglePanel>
        </template>
        <template #hierarchical_category="{ facet }">
          <BaseHeaderTogglePanel>
            <template #header-content>{{ facet.label }}</template>
            <SelectedFilters :facetId="facet.id" />
            <BaseAllFilter :facet="facet" />
            <BaseFilters v-slot="{ filter }" :filters="facet.filters">
              <BaseHierarchicalFilter :filter="filter" />
            </BaseFilters>
          </BaseHeaderTogglePanel>
        </template>
        <template #brand_facet="{ facet }">
          <BaseHeaderTogglePanel>
            <template #header-content>{{ facet.label }}</template>
            <SelectedFilters :facetId="facet.id" />
            <BaseFiltersSearch v-slot="{ siftedFilters }" :filters="facet.filters">
              <BaseSlicedFilters :filters="siftedFilters" :max="8">
                <template #default="{ slicedFilters }">
                  <BaseFilters v-slot="{ filter }" :filters="slicedFilters">
                    <BaseSimpleFilter :filter="filter" data-test="brand-filter" />
                  </BaseFilters>
                </template>
                <template #show-more="{ difference }">Show {{ difference }} more filters</template>
                <template #show-less="{ difference }">Show {{ difference }} less filters</template>
              </BaseSlicedFilters>
            </BaseFiltersSearch>
          </BaseHeaderTogglePanel>
        </template>
        <template #price_facet="{ facet }">
          <BaseHeaderTogglePanel>
            <template #header-content>{{ facet.label }}</template>
            <SelectedFilters :facetId="facet.id" />
            <BaseAllFilter :facet="facet" />
            <BaseFilters v-slot="{ filter }" :filters="facet.filters">
              <BaseNumberRangeFilter :filter="filter">
                <template #default="{ filter }">
                  <BasePriceFilterTitle
                    :filter="filter"
                    :configCurrency="{ format: 'i €' }"
                    lessThan="Less than {max}"
                    fromTo="From {min} to {max}"
                    from="More than {min}"
                  />
                </template>
              </BaseNumberRangeFilter>
            </BaseFilters>
          </BaseHeaderTogglePanel>
        </template>
      </Facets>
      <!-- Query Suggestions -->
      <div class="x-column">
        <h1>Query Suggestions</h1>
        <QuerySuggestions>
          <template #suggestion="{ suggestion }">
            <QuerySuggestion
              :suggestion="suggestion"
              :aria-label="`Query suggestion: ${suggestion.query}`"
            />
          </template>
        </QuerySuggestions>
      </div>
      <!-- History Queries -->
      <div class="x-column">
        <h1>History queries</h1>
        <HistoryQueries>
          <template #suggestion-remove-content="{ suggestion }">
            <span :aria-label="`Remove ${suggestion.query} from history`">x</span>
          </template>
        </HistoryQueries>
        <ClearHistoryQueries>Clear previous searches</ClearHistoryQueries>
      </div>
      <!-- Next Queries -->
      <div class="x-column">
        <h1>Next Queries</h1>
        <NextQueries />
      </div>
      <!-- Related Tags -->
      <div class="x-column">
        <h1>Related tags</h1>
        <RelatedTags />
      </div>
    </BaseKeyboardNavigation>
    <!-- Testing purpose -->
    <ul>
      <h1>Results</h1>
      <li v-for="result in results" :key="result.id" data-test="result-item">
        {{ result.name }}
      </li>
    </ul>
  </main>
</template>

<script lang="ts">
  import { Result } from '@empathy/search-types';
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import { State } from '../components/decorators/store.decorators';
  import BasePriceFilterTitle from '../components/filters/labels/base-price-filter-label.vue';
  import BaseAllFilter from '../components/filters/filters/base-all-filter.vue';
  import BaseSlicedFilters from '../components/filters/lists/base-sliced-filters.vue';
  import BaseHeaderTogglePanel from '../components/panels/base-header-toggle-panel.vue';
  import BaseFilters from '../components/filters/lists/base-filters.vue';
  import BaseHierarchicalFilter from '../components/filters/filters/base-hierarchical-filter.vue';
  import BaseNumberRangeFilter from '../components/filters/filters/base-number-range-filter.vue';
  import BaseKeyboardNavigation from '../components/base-keyboard-navigation.vue';
  import BaseSimpleFilter from '../components/filters/filters/base-simple-filter.vue';
  import ClearFilters from '../x-modules/facets/components/clear-filters.vue';
  import SelectedFiltersList from '../x-modules/facets/components/selected-filters-list.vue';
  import SelectedFilters from '../x-modules/facets/components/selected-filters.vue';
  // eslint-disable-next-line max-len
  import ClearHistoryQueries from '../x-modules/history-queries/components/clear-history-queries.vue';
  import ClearSearchInput from '../x-modules/search-box/components/clear-search-input.vue';
  import Facets from '../x-modules/facets/components/facets.vue';
  import HistoryQueries from '../x-modules/history-queries/components/history-queries.vue';
  import MultiSelectFilters from '../x-modules/facets/components/multi-select-filters.vue';
  import PopularSearches from '../x-modules/popular-searches/components/popular-searches.vue';
  import QuerySuggestion from '../x-modules/query-suggestions/components/query-suggestion.vue';
  import QuerySuggestions from '../x-modules/query-suggestions/components/query-suggestions.vue';
  import Recommendations from '../x-modules/recommendations/components/recommendations.vue';
  import SearchButton from '../x-modules/search-box/components/search-button.vue';
  import SearchInput from '../x-modules/search-box/components/search-input.vue';
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
      BaseAllFilter,
      BaseFilters,
      BaseSlicedFilters,
      BaseHeaderTogglePanel,
      BaseHierarchicalFilter,
      BaseNumberRangeFilter,
      BasePriceFilterTitle,
      BaseKeyboardNavigation,
      BaseSimpleFilter,
      ClearFilters,
      ClearHistoryQueries,
      ClearSearchInput,
      Facets,
      HistoryQueries,
      MultiSelectFilters,
      PopularSearches,
      QuerySuggestion,
      QuerySuggestions,
      Recommendations,
      SelectedFilters,
      SelectedFiltersList,
      SearchButton,
      SearchInput
    }
  })
  export default class App extends Vue {
    /* Testing purpose */
    @State('search', 'results')
    public results!: Result[];
  }
</script>

<style lang="scss">
  .x-column {
    display: inline-flex;
    flex-direction: column;
    width: 30%;
  }

  .x-facets-list {
    display: flex;
    flex-flow: row;
  }

  .x-header-toggle-panel {
    &__header {
      margin-bottom: 10px;
      font-weight: bold;
    }
  }
</style>
