<template>
  <main>
    <BaseIdModalOpen modalId="id-modal">Open search (id modal)</BaseIdModalOpen>
    <BaseIdModal :animation="collapseFromTop" modalId="id-modal">
      <SearchInput placeholder="Search" aria-label="Search for products" />
      <BaseIdModalClose aria-label="Close search" modalId="id-modal">x</BaseIdModalClose>
    </BaseIdModal>
    <BaseEventsModalOpen>Open search (events modal)</BaseEventsModalOpen>
    <BaseEventsModal :animation="collapseFromTop">
      <SearchInput placeholder="Search" aria-label="Search for products" />
      <BaseEventsModalClose aria-label="Close search">x</BaseEventsModalClose>
    </BaseEventsModal>
    <!-- Search Section -->
    <SearchInput placeholder="Search" aria-label="Search for products" />
    <ClearSearchInput aria-label="Clear query">Clear</ClearSearchInput>
    <SearchButton aria-label="Search"></SearchButton>
    <SlidingPanel>
      <RelatedTags :animation="staggeredFadeAndSlide" />
    </SlidingPanel>
    <Spellcheck>
      <template #default="{ query }">
        No results found for '{{ query }}'. We show you results for
        <SpellcheckButton />
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
          <AllFilter :facet="facet" />
          <MultiSelectFilters
            v-slot="{ filter }"
            :filters="facet.filters"
            :animation="staggeredFadeAndSlide"
          >
            <SimpleFilter :filter="filter" />
          </MultiSelectFilters>
        </BaseHeaderTogglePanel>
      </template>
      <template #hierarchical_category="{ facet }">
        <BaseHeaderTogglePanel>
          <template #header-content>{{ facet.label }}</template>
          <SelectedFilters :facetId="facet.id" />
          <AllFilter :facet="facet" />
          <Filters v-slot="{ filter }" :filters="facet.filters" :animation="staggeredFadeAndSlide">
            <HierarchicalFilter :filter="filter" />
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
          <Filters v-slot="{ filter }" :filters="facet.filters" :animation="staggeredFadeAndSlide">
            <NumberRangeFilter :filter="filter">
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
    <!-- BaseColumnPickerList -->
    <h1>Column Picker</h1>
    <h2>Column Picker List</h2>
    <div class="column-picker-container">
      Selected Columns Number: {{ currentColumn }}
      <BaseColumnPickerList #default="{ column }" v-model="currentColumn" :columns="[2, 4, 6]">
        <span>{{ column }}⇋</span>
      </BaseColumnPickerList>
      <button @click="currentColumn = 3">Set 3 columns</button>
    </div>

    <!-- BaseColumnPickerDropdown -->
    <h2>Column Picker Dropdown</h2>
    <div class="column-picker-container">
      Selected Columns Number: {{ currentColumn }}
      <BaseColumnPickerDropdown
        v-model="currentColumn"
        :columns="[2, 4, 6]"
        :animation="collapseFromTop"
      >
        <template #item="{ item, isSelected, isHighlighted }">
          <span v-if="isHighlighted">🟢</span>
          <span v-if="isSelected">✅</span>
          <span>{{ item }}</span>
        </template>
      </BaseColumnPickerDropdown>
    </div>

    <!-- Results -->
    <h1>Results {{ results.length }} / {{ $x.totalResults }}</h1>
    <BaseScroll
      @scroll="scroll"
      @scroll:direction-change="scrollDirectionChange"
      @scroll:at-start="scrollAtStart"
      @scroll:almost-at-end="scrollAlmostAtEnd"
      @scroll:at-end="scrollAtEnd"
    >
      <ResultsList :animation="staggeredFadeAndSlide">
        <template #layout="{ results, animation }">
          <BaseGrid :animation="animation" :items="results" :columns="currentColumn">
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
    </BaseScroll>
  </main>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import { Result } from '@empathy/search-types';
  import { getBannersStub } from '../__stubs__/banners-stubs.factory';
  import { getPromotedsStub } from '../__stubs__/promoteds-stubs.factory';
  import BaseGrid from '../components/base-grid.vue';
  import BaseScroll from '../components/base-scroll.vue';
  import BasePriceFilterTitle from '../components/filters/labels/base-price-filter-label.vue';
  import BaseCurrency from '../components/currency/base-currency.vue';
  import AllFilter from '../x-modules/facets/components/filters/all-filter.vue';
  import FiltersSearch from '../x-modules/facets/components/lists/filters-search.vue';
  import SlicedFilters from '../x-modules/facets/components/lists/sliced-filters.vue';
  import BaseEventsModal from '../components/modals/base-events-modal.vue';
  import BaseIdModalClose from '../components/modals/base-id-modal-close.vue';
  import BaseIdModalOpen from '../components/modals/base-id-modal-open.vue';
  import BaseIdModal from '../components/modals/base-id-modal.vue';
  import BaseHeaderTogglePanel from '../components/panels/base-header-toggle-panel.vue';
  import BaseEventsModalClose from '../components/modals/base-events-modal-close.vue';
  import Filters from '../x-modules/facets/components/lists/filters.vue';
  // eslint-disable-next-line max-len
  import HierarchicalFilter from '../x-modules/facets/components/filters/hierarchical-filter.vue';
  // eslint-disable-next-line max-len
  import NumberRangeFilter from '../x-modules/facets/components/filters/number-range-filter.vue';
  import BaseKeyboardNavigation from '../components/base-keyboard-navigation.vue';
  import BaseEventsModalOpen from '../components/modals/base-events-modal-open.vue';
  import BaseResultLink from '../components/result/base-result-link.vue';
  import BaseResultImage from '../components/result/base-result-image.vue';
  import SimpleFilter from '../x-modules/facets/components/filters/simple-filter.vue';
  import { GridItem } from '../utils/types';
  import ClearFilters from '../x-modules/facets/components/clear-filters.vue';
  import SelectedFiltersList from '../x-modules/facets/components/selected-filters-list.vue';
  import SelectedFilters from '../x-modules/facets/components/selected-filters.vue';
  // eslint-disable-next-line max-len
  import ClearHistoryQueries from '../x-modules/history-queries/components/clear-history-queries.vue';
  import SpellcheckButton from '../x-modules/search/components/spellcheck-button.vue';
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
  import BaseColumnPickerList from '../components/column-picker/base-column-picker-list.vue';
  // eslint-disable-next-line max-len
  import BaseColumnPickerDropdown from '../components/column-picker/base-column-picker-dropdown.vue';
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
      BaseScroll,
      AllFilter,
      Filters,
      FiltersSearch,
      SlicedFilters,
      BaseHeaderTogglePanel,
      HierarchicalFilter,
      NumberRangeFilter,
      BaseCurrency,
      BasePriceFilterTitle,
      BaseEventsModalClose,
      BaseKeyboardNavigation,
      BaseEventsModalOpen,
      BaseResultLink,
      BaseResultImage,
      SimpleFilter,
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
      SlidingPanel,
      Spellcheck,
      SpellcheckButton,
      BaseColumnPickerList,
      BaseColumnPickerDropdown
    }
  })
  export default class App extends Vue {
    protected showEmpathize = getURLParameter('showEmpathize') === 'true';
    protected loadOnInit = getURLParameter('loadOnInit') === 'true';
    protected fadeAndSlide = FadeAndSlide;
    protected staggeredFadeAndSlide = StaggeredFadeAndSlide;
    protected collapseFromTop = CollapseFromTop;
    protected currentColumn = 2;

    @State('search', 'results')
    public results!: Result[];

    @State('identifierResults', 'identifierResults')
    public identifierResults!: Result[];

    @State('recommendations', 'recommendations')
    public recommendations!: Result[];

    protected get gridItems(): GridItem[] {
      return [...getBannersStub(), ...getPromotedsStub(), ...this.results];
    }

    protected scroll(position: number): void {
      /* eslint-disable no-console */
      console.log('scroll', position);
    }

    protected scrollDirectionChange(direction: string): void {
      /* eslint-disable no-console */
      console.log('scroll:direction-change', direction);
    }

    protected scrollAtStart(): void {
      /* eslint-disable no-console */
      console.log('scroll:at-start');
    }

    protected scrollAlmostAtEnd(distance: number): void {
      /* eslint-disable no-console */
      console.log('scroll:almost-at-end', distance);
    }

    protected scrollAtEnd(): void {
      /* eslint-disable no-console */
      console.log('scroll:at-end');
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
    max-width: 250px;

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
  .column-picker-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    .x-column-picker-list {
      margin: 0 10px;
    }
  }

  .x-base-scroll {
    height: 500px;
  }
</style>
