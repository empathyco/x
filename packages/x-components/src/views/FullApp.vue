<template>
  <main>
    <!-- Phantom components -->
    <DeviceDetector :breakpoints="breakpoints" />

    <!-- Search Box -->
    <div class="x-search-box x-input-group x-input-group--card">
      <SearchInput placeholder="Search" aria-label="Search for products" />
      <ClearSearchInput aria-label="Clear query">Clear</ClearSearchInput>
      <SearchButton class="x-input-group__action" aria-label="Search">
        <SearchIcon />
      </SearchButton>
    </div>

    <!-- Spellcheck -->
    <Spellcheck>
      <template #default="{ query }">
        No results found for '{{ query }}'. We show you results for
        <SpellcheckButton />
      </template>
    </Spellcheck>

    <!-- Empathize -->
    <Empathize :animation="collapseFromTop">
      <BaseKeyboardNavigation>
        <!-- Close Empathize -->
        <BaseEventsModalClose
          key="closeButton"
          class="x-empathize__close x-button--ghost"
          closingEvent="UserClosedEmpathize"
        >
          <CrossIcon />
        </BaseEventsModalClose>

        <!-- Query Suggestions -->
        <div class="x-column">
          <h1 v-if="$x.querySuggestions.length" class="x-title1">Query Suggestions</h1>

          <QuerySuggestions :animation="fadeAndSlide">
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
          <h1 v-if="$x.historyQueries.length" class="x-title1">History queries</h1>

          <HistoryQueries :animation="fadeAndSlide" max-items-to-render="5">
            <template #suggestion-remove-content="{ suggestion }">
              <CrossIcon :aria-label="`Remove ${suggestion.query} from history`" />
            </template>
          </HistoryQueries>

          <!--    Clear History Queries      -->
          <ClearHistoryQueries v-if="$x.historyQueries.length" class="x-button--ghost">
            Clear History
          </ClearHistoryQueries>
        </div>

        <!-- Popular Searches -->
        <div class="x-column">
          <h1 v-if="$x.popularSearches.length" class="x-title1">Popular Searches</h1>

          <PopularSearches :animation="fadeAndSlide" />
        </div>

        <!-- Next Queries -->
        <div class="x-column">
          <h1 v-if="$x.nextQueries.length" class="x-title1">Next Queries</h1>

          <NextQueries :animation="fadeAndSlide" :maxItemsToRender="10" />
        </div>
      </BaseKeyboardNavigation>
    </Empathize>

    <!-- Related Tags -->
    <div class="x-column">
      <h1 v-if="$x.relatedTags.length" class="x-title1">Related tags</h1>
      <SlidingPanel>
        <RelatedTags :animation="staggeredFadeAndSlide" class="x-list--gap-03" />
      </SlidingPanel>
    </div>

    <!-- Facets -->
    <h1 v-if="Object.keys($x.facets).length" class="x-title1">Facets</h1>

    <!--  Selected Filters  -->
    <SelectedFilters>
      <template #default="{ selectedFilters }">
        <span class="x-title3">Filters selected: {{ selectedFilters.length }}</span>
      </template>
    </SelectedFilters>
    <SelectedFiltersList
      class="x-list--horizontal x-list--gap-02"
      :animation="staggeredFadeAndSlide"
    >
      <template #default="{ filter }">Default: {{ filter.label }}</template>
      <template #brand_facet="{ filter }">Brand: {{ filter.label }}</template>
      <template #age_facet="{ filter }">Age: {{ filter.label }}</template>
      <template #price_facet="{ filter }">Price: {{ filter.label }}</template>
    </SelectedFiltersList>

    <ClearFilters v-slot="{ selectedFilters }">
      Clear {{ selectedFilters.length }} filters
    </ClearFilters>

    <Facets class="x-list--horizontal x-facet--line x-list--gap-04">
      <!--  Default Facet    -->
      <template #default="{ facet }">
        <BaseHeaderTogglePanel class="x-facet">
          <template #header-content>
            <span>{{ facet.label }}</span>
            <ChevronDownIcon />
          </template>
          <SelectedFilters :facetId="facet.id" />
          <AllFilter :facet="facet" />
          <FiltersList
            v-slot="{ filter }"
            :filters="facet.filters"
            :animation="staggeredFadeAndSlide"
          >
            <SimpleFilter :filter="filter" />
          </FiltersList>
        </BaseHeaderTogglePanel>
      </template>

      <!--   Hierarchical Facet   -->
      <template #hierarchical_category="{ facet }">
        <BaseHeaderTogglePanel class="x-facet">
          <template #header-content>
            <span>{{ facet.label }}</span>
            <ChevronDownIcon />
          </template>
          <SelectedFilters :facetId="facet.id" />
          <AllFilter :facet="facet" />
          <Filters
            v-slot="{ filter: hierarchicalFilter }"
            :filters="facet.filters"
            :animation="staggeredFadeAndSlide"
          >
            <HierarchicalFilter
              v-slot="{ filter, clickFilter, cssClasses, isDisabled }"
              :filter="hierarchicalFilter"
            >
              <label :class="cssClasses">
                <input @change="clickFilter" :disabled="isDisabled" type="checkbox" />
                {{ filter.label }}
              </label>
            </HierarchicalFilter>
          </Filters>
        </BaseHeaderTogglePanel>
      </template>

      <!--  Facet with FiltersSearch    -->
      <template #brand_facet="{ facet }">
        <BaseHeaderTogglePanel class="x-facet">
          <template #header-content>
            <span>{{ facet.label }}</span>
            <ChevronDownIcon />
          </template>
          <SelectedFilters :facetId="facet.id" />
          <FiltersSearch :filters="facet.filters">
            <SlicedFilters :max="8">
              <SortedFilters>
                <Filters v-slot="{ filter }">
                  <SimpleFilter
                    v-slot="{ filter: slotFilter, clickFilter, cssClasses }"
                    :filter="filter"
                    data-test="brand-filter"
                  >
                    <label :class="cssClasses">
                      <input @change="clickFilter" type="checkbox" :checked="filter.selected" />
                      {{ slotFilter.label }}
                    </label>
                  </SimpleFilter>
                </Filters>
                <template #show-more="{ difference }">Show {{ difference }} more filters</template>
                <template #show-less="{ difference }">Show {{ difference }} less filters</template>
              </SortedFilters>
            </SlicedFilters>
          </FiltersSearch>
        </BaseHeaderTogglePanel>
      </template>
      <template #price_facet="{ facet }">
        <BaseHeaderTogglePanel class="x-facet">
          <template #header-content>
            <span>{{ facet.label }}</span>
            <ChevronDownIcon />
          </template>
          <SelectedFilters :facetId="facet.id" />
          <AllFilter :facet="facet" />
          <SortedFilters :filters="facet.filters">
            <FiltersList v-slot="{ filter }" :animation="staggeredFadeAndSlide">
              <NumberRangeFilter :filter="filter">
                <template #default="{ filter }">
                  <BasePriceFilterLabel
                    :filter="filter"
                    format="i €"
                    lessThan="Less than {max}"
                    fromTo="From {min} to {max}"
                    from="More than {min}"
                  />
                </template>
              </NumberRangeFilter>
            </FiltersList>
          </SortedFilters>
        </BaseHeaderTogglePanel>
      </template>
    </Facets>
    <!-- Recommendations -->
    <h1 class="x-title1">Recommendations</h1>
    <Recommendations :animation="staggeredFadeAndSlide">
      <template #layout="{ recommendations, animation }">
        <BaseGrid :animation="animation" :items="recommendations">
          <template #Result="{ item }">
            <BaseResultLink :result="item">
              <BaseResultImage :result="item" />
              <span class="x-result__title">{{ item.name }}</span>
            </BaseResultLink>
          </template>
        </BaseGrid>
      </template>
    </Recommendations>

    <!-- Identifier Results -->
    <h1 v-if="$x.identifierResults.length" class="x-title1">Identifier Results</h1>

    <BaseGrid :animation="staggeredFadeAndSlide" :items="identifierResults">
      <template #Result="{ item }">
        <BaseResultLink :result="item" class="x-result-link">
          <template #default="{ result }">
            <IdentifierResult :result="result" />
          </template>
        </BaseResultLink>
      </template>
    </BaseGrid>

    <!-- Sort -->
    <section>
      <h1 class="x-title1">Sort</h1>

      <SortDropdown :items="sortValues">
        <template #toggle="{ item, isOpen }">
          <span>{{ item || 'Default' }}</span>
          <span v-if="isOpen" class="x-icon"><ChevronUpIcon /></span>
          <span v-else class="x-icon"><ChevronDownIcon /></span>
        </template>
        <template #item="{ item, isHighlighted, isSelected }">
          <span v-if="isSelected"><CheckIcon /></span>
          {{ item || 'Default' }}
          <span v-if="isHighlighted"><ChevronLeftIcon /></span>
        </template>
      </SortDropdown>

      <SortList :items="sortValues">
        <template #default="{ item, isSelected }">
          <span v-if="isSelected"><CheckIcon /></span>
          {{ item || 'Default' }}
        </template>
      </SortList>
    </section>

    <!-- Column Picker -->
    <section>
      <h1 class="x-title1">Column Picker</h1>

      <span class="x-text">Selected Columns Number:</span>
      <span class="x-title3">{{ currentColumn }}</span>
      <button @click="currentColumn = 3" class="x-button x-button--ghost">Set 3 columns</button>

      <BaseColumnPickerDropdown
        v-model="currentColumn"
        :columns="[2, 4, 6]"
        :animation="collapseFromTop"
      >
        <template #item="{ item, isSelected, isHighlighted }">
          <span v-if="isSelected"><CheckIcon /></span>
          <span>{{ item }}</span>
          <span v-if="isHighlighted"><ChevronLeftIcon /></span>
        </template>
      </BaseColumnPickerDropdown>

      <BaseColumnPickerList
        #default="{ column }"
        v-model="currentColumn"
        :columns="[2, 4, 6]"
        class="x-list--gap-03"
      >
        <span>{{ column }}</span>
      </BaseColumnPickerList>
    </section>

    <!-- Results -->
    <h1 class="x-title1">Results {{ results.length }} / {{ $x.totalResults }}</h1>
    <BaseScrollToTop scroll-id="scrollId" :threshold-px="1000">
      <span>⬆</span>
    </BaseScrollToTop>
    <BaseIdScroll id="scrollId">
      <ResultsList #default="{ items }">
        <BaseGrid :animation="staggeredFadeAndSlide" :items="items" :columns="currentColumn">
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
      </ResultsList>
    </BaseIdScroll>
    <!-- Partial Results -->
    <h1 class="x-title1">Partial Results</h1>
    <PartialResultsList :animation="staggeredFadeAndSlide">
      <template #default="{ partialResult }">
        <span>{{ partialResult.query }}</span>
        <BaseGrid :animation="staggeredFadeAndSlide" :columns="4" :items="partialResult.results">
          <template #Result="{ item }">
            <BaseResultLink :result="item" class="x-result-link">
              <BaseResultImage :result="item" />
              <span class="x-result__title">{{ item.name }}</span>
            </BaseResultLink>
          </template>
        </BaseGrid>
        <PartialQueryButton :query="partialResult.query">
          <template #default="{ query }">Ver todos {{ query }}</template>
        </PartialQueryButton>
      </template>
    </PartialResultsList>
  </main>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import { Result, Sort } from '@empathyco/x-types';
  import { getBannersStub } from '../__stubs__/banners-stubs.factory';
  import { getPromotedsStub } from '../__stubs__/promoteds-stubs.factory';
  import BaseGrid from '../components/base-grid.vue';
  import {
    SearchIcon,
    CrossIcon,
    ChevronLeftIcon,
    ChevronUpIcon,
    ChevronDownIcon,
    CheckIcon
  } from '../components/icons/index';
  import BaseIdScroll from '../components/scroll/base-id-scroll.vue';
  import BasePriceFilterLabel from '../components/filters/labels/base-price-filter-label.vue';
  import BaseCurrency from '../components/currency/base-currency.vue';
  import DeviceDetector from '../x-modules/device/components/device-detector.vue';
  import AllFilter from '../x-modules/facets/components/filters/all-filter.vue';
  import FiltersSearch from '../x-modules/facets/components/lists/filters-search.vue';
  import SlicedFilters from '../x-modules/facets/components/lists/sliced-filters.vue';
  import BaseEventsModal from '../components/modals/base-events-modal.vue';
  import BaseIdModalClose from '../components/modals/base-id-modal-close.vue';
  import BaseIdModalOpen from '../components/modals/base-id-modal-open.vue';
  import BaseIdModal from '../components/modals/base-id-modal.vue';
  import BaseScrollToTop from '../components/scroll/base-scroll-to-top.vue';
  import BaseHeaderTogglePanel from '../components/panels/base-header-toggle-panel.vue';
  import BaseEventsModalClose from '../components/modals/base-events-modal-close.vue';
  import FiltersList from '../x-modules/facets/components/lists/filters-list.vue';
  import HierarchicalFilter from '../x-modules/facets/components/filters/hierarchical-filter.vue';
  import NumberRangeFilter from '../x-modules/facets/components/filters/number-range-filter.vue';
  import BaseKeyboardNavigation from '../components/base-keyboard-navigation.vue';
  import BaseEventsModalOpen from '../components/modals/base-events-modal-open.vue';
  import BaseResultLink from '../components/result/base-result-link.vue';
  import BaseResultImage from '../components/result/base-result-image.vue';
  import SimpleFilter from '../x-modules/facets/components/filters/simple-filter.vue';
  import { Dictionary, SearchItem } from '../utils/types';
  import ClearFilters from '../x-modules/facets/components/clear-filters.vue';
  import SelectedFiltersList from '../x-modules/facets/components/lists/selected-filters-list.vue';
  import SortedFilters from '../x-modules/facets/components/lists/sorted-filters.vue';
  import SelectedFilters from '../x-modules/facets/components/lists/selected-filters.vue';
  // eslint-disable-next-line max-len
  import ClearHistoryQueries from '../x-modules/history-queries/components/clear-history-queries.vue';
  import PartialQueryButton from '../x-modules/search/components/partial-query-button.vue';
  import PartialResultsList from '../x-modules/search/components/partial-results-list.vue';
  import SortList from '../x-modules/search/components/sort-list.vue';
  import HistoryQuery from '../x-modules/history-queries/components/history-query.vue';
  import SpellcheckButton from '../x-modules/search/components/spellcheck-button.vue';
  import Spellcheck from '../x-modules/search/components/spellcheck.vue';
  import ClearSearchInput from '../x-modules/search-box/components/clear-search-input.vue';
  import CollapseFromTop from '../components/animations/collapse-from-top.vue';
  import Empathize from '../x-modules/empathize/components/empathize.vue';
  import Facets from '../x-modules/facets/components/facets/facets.vue';
  import FadeAndSlide from '../components/animations/fade-and-slide.vue';
  import HistoryQueries from '../x-modules/history-queries/components/history-queries.vue';
  import IdentifierResult from '../x-modules/identifier-results/components/identifier-result.vue';
  import IdentifierResults from '../x-modules/identifier-results/components/identifier-results.vue';
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
  import SortDropdown from '../x-modules/search/components/sort-dropdown.vue';
  import { baseInstallXOptions, baseSnippetConfig } from './base-config';

  @Component({
    beforeRouteEnter(_to, _from, next: () => void): void {
      XPlugin.registerXModule(searchXModule);

      new XInstaller(baseInstallXOptions).init(baseSnippetConfig);
      next();
    },
    components: {
      DeviceDetector,
      CrossIcon,
      ChevronLeftIcon,
      ChevronUpIcon,
      ChevronDownIcon,
      CheckIcon,
      PartialQueryButton,
      PartialResultsList,
      SortDropdown,
      ResultsList,
      BaseGrid,
      BaseIdModalClose,
      BaseIdModalOpen,
      BaseIdModal,
      BaseEventsModal,
      BaseIdScroll,
      BaseScrollToTop,
      AllFilter,
      FiltersList,
      FiltersSearch,
      SlicedFilters,
      BaseHeaderTogglePanel,
      HierarchicalFilter,
      NumberRangeFilter,
      BaseCurrency,
      BasePriceFilterLabel,
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
      HistoryQuery,
      HistoryQueries,
      IdentifierResult,
      IdentifierResults,
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
      SearchIcon,
      SlidingPanel,
      Spellcheck,
      SpellcheckButton,
      BaseColumnPickerList,
      BaseColumnPickerDropdown,
      SortList,
      SortedFilters
    }
  })
  export default class App extends Vue {
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

    protected get gridItems(): SearchItem[] {
      return [...getBannersStub(), ...getPromotedsStub(), ...this.results];
    }

    public sortValues: Sort[] = ['', 'priceSort asc', 'priceSort desc'];

    protected breakpoints: Dictionary<number> = {
      small: 500,
      medium: 900,
      large: Number.POSITIVE_INFINITY
    };
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

    + .x-column {
      margin-left: var(--x-size-07, 20px);
    }
  }

  .x-search-box {
    max-width: 400px;
  }

  .x-empathize {
    background-color: var(--x-color-base-neutral-95);
    border-radius: var(--x-border-radius-base-s);
    z-index: 2;
    width: 100%;
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

  .x-filter--is-selected,
  .x-all-filter--is-selected {
    font-weight: bold;
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
    scroll-behavior: smooth;
  }

  .x-scroll-to-top {
    position: absolute;
    right: 50px;
    z-index: 2;
    margin: 10px;
  }

  .x-modal__content {
    background-color: white;
    width: 500px;
  }

  .x-selected-filters-list {
    display: flex;

    &__item {
      flex: 0 1 auto;
    }
  }
</style>
