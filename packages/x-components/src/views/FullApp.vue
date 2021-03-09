<template>
  <main>
    <BaseIdModalOpen modalId="id-modal">Open search (id modal)</BaseIdModalOpen>
    <BaseIdModal :animation="collapseFromTop" modalId="id-modal">
      <SearchInput placeholder="Search" aria-label="Search for products" />
      <BaseIdModalClose aria-label="Close search" modalId="id-modal">x</BaseIdModalClose>
    </BaseIdModal>
    <BaseEventsOpenButton>Open search (events modal)</BaseEventsOpenButton>
    <BaseEventsModal :animation="collapseFromTop">
      <SearchInput placeholder="Search" aria-label="Search for products" />
      <BaseEventsCloseButton aria-label="Close search">x</BaseEventsCloseButton>
    </BaseEventsModal>
    <!-- Search Section -->
    <SearchInput placeholder="Search" aria-label="Search for products" />
    <ClearSearchInput aria-label="Clear query">Clear</ClearSearchInput>
    <SearchButton aria-label="Search"></SearchButton>
    <SlidingPanel>
      <RelatedTags :animation="staggeredFadeAndSlide" />
    </SlidingPanel>
    <Spellcheck>
      <template #default="{ query, spellcheckedQuery }">
        No results found for '{{ query }}'. We show you results for '{{ spellcheckedQuery }}'
      </template>
    </Spellcheck>
    <!-- Facets -->
    <h1>Facets</h1>
    <SelectedFilters>
      <template #default="{ selectedFilters }">
        Filters selected: {{ selectedFilters.length }}
      </template>
    </SelectedFilters>

    <SelectedFiltersList :animation="staggeredFadeAndSlide">
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
          <MultiSelectFilters
            v-slot="{ filter }"
            :filters="facet.filters"
            :animation="staggeredFadeAndSlide"
          >
            <BaseSimpleFilter :filter="filter" />
          </MultiSelectFilters>
        </BaseHeaderTogglePanel>
      </template>
      <template #hierarchical_category="{ facet }">
        <BaseHeaderTogglePanel>
          <template #header-content>{{ facet.label }}</template>
          <SelectedFilters :facetId="facet.id" />
          <BaseAllFilter :facet="facet" />
          <BaseFilters
            v-slot="{ filter }"
            :filters="facet.filters"
            :animation="staggeredFadeAndSlide"
          >
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
          <BaseFilters
            v-slot="{ filter }"
            :filters="facet.filters"
            :animation="staggeredFadeAndSlide"
          >
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
    <!-- Empathize -->
    <Empathize v-if="showEmpathize" :animation="collapseFromTop">
      <BaseKeyboardNavigation>
        <BaseCloseButton
          key="closeButton"
          class="x-empathize__close"
          closingEvent="UserClosedEmpathize"
        >
          ×
        </BaseCloseButton>
        <div class="x-column">
          <h1>Suggestions</h1>
          <QuerySuggestions :animation="fadeAndSlide">
            <template #suggestion="{ suggestion }">
              <QuerySuggestion
                :suggestion="suggestion"
                :aria-label="`Query suggestion: ${suggestion.query}`"
              />
            </template>
          </QuerySuggestions>
          <NoSuggestions message="We couldn't find any suggestion. Try searching for {query}." />
        </div>
        <div class="x-column">
          <h1>Previous Searches</h1>
          <HistoryQueries :animation="fadeAndSlide"></HistoryQueries>
          <ClearHistoryQueries>Clear previous searches</ClearHistoryQueries>
        </div>
        <div class="x-column">
          <h1>Trending</h1>
          <PopularSearches :animation="fadeAndSlide" />
        </div>
      </BaseKeyboardNavigation>
    </Empathize>
    <BaseKeyboardNavigation v-else>
      <!-- Query Suggestions -->
      <div class="x-column">
        <h1>Query Suggestions</h1>
        <QuerySuggestions :animation="fadeAndSlide">
          <template #suggestion="{ suggestion }">
            <QuerySuggestion
              :suggestion="suggestion"
              :aria-label="`Query suggestion: ${suggestion.query}`"
            />
          </template>
        </QuerySuggestions>
        <NoSuggestions message="We couldn't find any suggestion. Try searching for {query}." />
      </div>
      <!-- History Queries -->
      <div class="x-column">
        <h1>History queries</h1>
        <HistoryQueries :animation="fadeAndSlide">
          <template #suggestion-remove-content="{ suggestion }">
            <span :aria-label="`Remove ${suggestion.query} from history`">x</span>
          </template>
        </HistoryQueries>
        <ClearHistoryQueries>Clear previous searches</ClearHistoryQueries>
      </div>
      <!-- Popular Searches -->
      <div class="x-column">
        <h1>Popular Searches</h1>
        <PopularSearches :animation="fadeAndSlide" />
      </div>
      <!-- Next Queries -->
      <div class="x-column">
        <h1>Next Queries</h1>
        <NextQueries :animation="fadeAndSlide" :maxItemsToRender="10" />
      </div>
      <!-- Related Tags -->
      <div class="x-column">
        <h1>Related tags</h1>
        <RelatedTags :animation="staggeredFadeAndSlide" />
      </div>
    </BaseKeyboardNavigation>
    <!-- Recommendations -->
    <h1>Recommendations</h1>
    <BaseGrid :animation="staggeredFadeAndSlide" :columns="4" :items="recommendations">
      <template #Result="{ item }">
        <BaseResultLink :result="item" class="x-result-link">
          <BaseResultImage :result="item" />
          <span class="x-result__title">{{ item.name }}</span>
        </BaseResultLink>
      </template>
    </BaseGrid>
    <!-- Identifier Results -->
    <h1>Identifier Results</h1>
    <BaseGrid :animation="staggeredFadeAndSlide" :items="identifierResults">
      <template #Result="{ item }">
        <BaseResultLink :result="item" class="x-result-link">
          <template #default="{ result }">
            <IdentifierResult :result="result" />
          </template>
        </BaseResultLink>
      </template>
    </BaseGrid>
    <!-- Results -->
    <h1>Results</h1>
    <ResultsList :animation="staggeredFadeAndSlide">
      <template #layout="{ results, animation }">
        <BaseGrid :animation="animation" :items="results">
          <template #Result="{ item }">
            <BaseResultLink :result="item">
              <template #default="{ result }">
                <BaseResultImage :result="result" />
                <span>{{ result.name }}</span>
              </template>
            </BaseResultLink>
          </template>
          <template #Banner="{ item }">
            <span>{{ item.title }}</span>
          </template>
          <template #Promoted="{ item }">
            <span>{{ item.title }}</span>
          </template>
        </BaseGrid>
      </template>
    </ResultsList>
  </main>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import { Result } from '@empathy/search-types';
  import { getBannersStub } from '../__stubs__/banners-stubs.factory';
  import { getPromotedsStub } from '../__stubs__/promoteds-stubs.factory';
  import BaseGrid from '../components/base-grid.vue';
  import BasePriceFilterTitle from '../components/filters/labels/base-price-filter-label.vue';
  import BaseCurrency from '../components/currency/base-currency.vue';
  import BaseAllFilter from '../components/filters/filters/base-all-filter.vue';
  import BaseFiltersSearch from '../components/filters/lists/base-filters-search.vue';
  import BaseSlicedFilters from '../components/filters/lists/base-sliced-filters.vue';
  import BaseEventsModal from '../components/modals/base-events-modal.vue';
  import BaseIdModalClose from '../components/modals/base-id-modal-close.vue';
  import BaseIdModalOpen from '../components/modals/base-id-modal-open.vue';
  import BaseIdModal from '../components/modals/base-id-modal.vue';
  import BaseHeaderTogglePanel from '../components/panels/base-header-toggle-panel.vue';
  import BaseEventsModalClose from '../components/modals/base-events-modal-close.vue';
  import BaseFilters from '../components/filters/lists/base-filters.vue';
  import BaseHierarchicalFilter from '../components/filters/filters/base-hierarchical-filter.vue';
  import BaseNumberRangeFilter from '../components/filters/filters/base-number-range-filter.vue';
  import BaseKeyboardNavigation from '../components/base-keyboard-navigation.vue';
  import BaseEventsOpenButton from '../components/modals/base-events-modal-open.vue';
  import BaseResultLink from '../components/result/base-result-link.vue';
  import BaseResultImage from '../components/result/base-result-image.vue';
  import BaseSimpleFilter from '../components/filters/filters/base-simple-filter.vue';
  import { Identifiable } from '../utils/types';
  import ClearFilters from '../x-modules/facets/components/clear-filters.vue';
  import SelectedFiltersList from '../x-modules/facets/components/selected-filters-list.vue';
  import SelectedFilters from '../x-modules/facets/components/selected-filters.vue';
  // eslint-disable-next-line max-len
  import ClearHistoryQueries from '../x-modules/history-queries/components/clear-history-queries.vue';
  import Spellcheck from '../x-modules/search/components/spellcheck.vue';
  import ClearSearchInput from '../x-modules/search-box/components/clear-search-input.vue';
  import CollapseFromTop from '../components/animations/collapse-from-top.vue';
  import Empathize from '../x-modules/empathize/components/empathize.vue';
  import Facets from '../x-modules/facets/components/facets.vue';
  import FadeAndSlide from '../components/animations/fade-and-slide.vue';
  import HistoryQueries from '../x-modules/history-queries/components/history-queries.vue';
  import IdentifierResult from '../x-modules/identifier-results/components/identifier-result.vue';
  import IdentifierResults from '../x-modules/identifier-results/components/identifier-results.vue';
  import MultiSelectFilters from '../x-modules/facets/components/multi-select-filters.vue';
  import NextQueries from '../x-modules/next-queries/components/next-queries.vue';
  import NoSuggestions from '../x-modules/no-suggestions/components/no-suggestions.vue';
  import PopularSearches from '../x-modules/popular-searches/components/popular-searches.vue';
  import QuerySuggestion from '../x-modules/query-suggestions/components/query-suggestion.vue';
  import QuerySuggestions from '../x-modules/query-suggestions/components/query-suggestions.vue';
  import Recommendations from '../x-modules/recommendations/components/recommendations.vue';
  import RelatedTags from '../x-modules/related-tags/components/related-tags.vue';
  import SearchButton from '../x-modules/search-box/components/search-button.vue';
  import SearchInput from '../x-modules/search-box/components/search-input.vue';
  import SlidingPanel from '../components/sliding-panel.vue';
  import StaggeredFadeAndSlide from '../components/animations/staggered-fade-and-slide.vue';
  import { State } from '../components/decorators/store.decorators';
  import { getURLParameter } from '../utils/get-url-parameters';
  import ResultsList from '../x-modules/search/components/results-list.vue';
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
      ResultsList,
      BaseGrid,
      BaseIdModalClose,
      BaseIdModalOpen,
      BaseIdModal,
      BaseEventsModal,
      BaseAllFilter,
      BaseFilters,
      BaseFiltersSearch,
      BaseSlicedFilters,
      BaseHeaderTogglePanel,
      BaseHierarchicalFilter,
      BaseNumberRangeFilter,
      BaseCurrency,
      BasePriceFilterTitle,
      BaseEventsCloseButton: BaseEventsModalClose,
      BaseKeyboardNavigation,
      BaseEventsOpenButton,
      BaseResultLink,
      BaseResultImage,
      BaseSimpleFilter,
      Spellcheck,
      ClearFilters,
      ClearHistoryQueries,
      ClearSearchInput,
      Empathize,
      Facets,
      HistoryQueries,
      IdentifierResult,
      IdentifierResults,
      MultiSelectFilters,
      NextQueries,
      NoSuggestions,
      PopularSearches,
      QuerySuggestion,
      QuerySuggestions,
      Recommendations,
      RelatedTags,
      SelectedFilters,
      SelectedFiltersList,
      SearchButton,
      SearchInput,
      SlidingPanel
    }
  })
  export default class App extends Vue {
    protected showEmpathize = getURLParameter('showEmpathize') === 'true';
    protected loadOnInit = getURLParameter('loadOnInit') === 'true';
    protected fadeAndSlide = FadeAndSlide;
    protected staggeredFadeAndSlide = StaggeredFadeAndSlide;
    protected collapseFromTop = CollapseFromTop;

    @State('search', 'results')
    public results!: Result[];

    @State('identifierResults', 'identifierResults')
    public identifierResults!: Result[];

    @State('recommendations', 'recommendations')
    public recommendations!: Result[];

    protected get gridItems(): Identifiable[] {
      return [...getBannersStub(), ...getPromotedsStub(), ...this.results];
    }
  }
</script>

<style lang="scss">
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    margin-top: 60px;
    text-align: center;
    color: #2c3e50;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .x-modal-content {
    background-color: white;
    height: 200px;
    width: 100%;
  }

  .x-column {
    display: inline-flex;
    flex-direction: column;
    width: 30%;
  }

  .x-empathize {
    background-color: white;
    border: 1px dashed black;
    border-radius: 20px;
    z-index: 2;
    width: 600px;
    position: relative;

    &__close {
      position: absolute;
      top: 20px;
      right: 20px;
    }
  }

  .x-sliding-panel {
    max-width: 500px;

    &__scroll {
      white-space: nowrap;

      > ul {
        padding: 0;

        & > li {
          display: inline-block;
          text-decoration: none;
        }
      }
    }
  }

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

  .x-base-grid {
    column-gap: 10px;
    row-gap: 10px;

    &__item {
      padding: 20px 0;
      text-align: center;
      border: 1px solid black;
      border-radius: 5px;
    }

    &__banner {
      grid-column: -1/1;
      border-color: crimson;
    }

    &__promoted {
      grid-column: 1 / span 2;
      border-color: darkgreen;
    }
  }
</style>
