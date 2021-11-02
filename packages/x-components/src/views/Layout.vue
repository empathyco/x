<template>
  <div>
    <ExtraParams :values="initialExtraParams" />
    <UrlHandler query="q" store="store" />
    <BaseEventsModalOpen>Start</BaseEventsModalOpen>
    <h1>Test controls</h1>
    <ul class="x-test-controls x-list x-list--gap-05">
      <li class="x-test-controls__item x-list__item">
        <label>
          <input
            v-model="controls.searchInput.instant"
            type="checkbox"
            data-test="search-input-instant"
          />
          search-input - instant
        </label>
      </li>
      <li class="x-test-controls__item x-list__item">
        <label for="searchInput.instantDebounceInMs">search-input - debounce</label>
        <input
          v-model="controls.searchInput.instantDebounceInMs"
          id="searchInput.instantDebounceInMs"
          type="number"
          data-test="search-input-debounce"
        />
      </li>
      <li class="x-test-controls__item x-list__item">
        <label for="popularSearches.maxItemsToRender">popular-searches - maxItemsToRender</label>
        <input
          v-model="controls.popularSearches.maxItemsToRender"
          id="popularSearches.maxItemsToRender"
          type="number"
          data-test="popular-searches-max-to-render"
        />
      </li>
      <li class="x-test-controls__item x-list__item">
        <label>
          <input
            v-model="controls.slicedFilters.max"
            type="number"
            data-test="sliced-filters-max"
          />
          sliced-filters - max
        </label>
      </li>
      <li class="x-test-controls__item x-list__item">
        <label for="historyQueries.maxItemsToRender">history-queries - maxItemsToRender</label>
        <input
          v-model="controls.historyQueries.maxItemsToRender"
          id="historyQueries.maxItemsToRender"
          type="number"
          data-test="history-queries-max-to-render"
        />
      </li>
    </ul>
    <BaseKeyboardNavigation>
      <BaseEventsModal :eventsToOpenModal="eventsToOpenModal">
        <MultiColumnMaxWidthLayout class="x-background--neutral-100">
          <template #header-middle>
            <div
              class="
                x-list x-list--vertical x-list--gap-05 x-list--align-stretch x-list__item--expand
              "
            >
              <div class="x-input-group x-input-group--card">
                <SearchInput
                  aria-label="Search for products"
                  placeholder="Search"
                  :instant="controls.searchInput.instant"
                  :instant-debounce-in-ms="controls.searchInput.instantDebounceInMs"
                />
                <ClearSearchInput aria-label="Clear query">Clear</ClearSearchInput>
                <SearchButton aria-label="Search" class="x-input-group__action">
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

              <SlidingPanel v-if="$x.relatedTags.length">
                <template #sliding-panel-left-button>
                  <ChevronLeft />
                </template>
                <RelatedTags class="x-tag--card x-list--gap-03" />
                <template #sliding-panel-right-button>
                  <ChevronRight />
                </template>
              </SlidingPanel>
            </div>
          </template>

          <template #header-end>
            <BaseEventsModalClose lass="x-button--ghost">
              <CrossIcon />
            </BaseEventsModalClose>
          </template>

          <template #sub-header>
            <Empathize
              :animation="empathizeAnimation"
              class="
                x-list x-list--horizontal x-list--padding-05 x-list--padding-bottom x-list--gap-06
              "
            >
              <PopularSearches max-items-to-render="10" />
              <HistoryQueries :max-items-to-render="controls.historyQueries.maxItemsToRender" />
              <ClearHistoryQueries class="x-button--ghost x-button--ghost-start">
                <CrossTinyIcon />
                <span>Clear previous searches</span>
              </ClearHistoryQueries>
              <QuerySuggestions max-items-to-render="10" />
              <NextQueries max-items-to-render="10" />
            </Empathize>
          </template>

          <template #toolbar-aside>
            <BaseIdTogglePanelButton
              v-if="$x.totalResults > 0"
              class="x-button x-button--ghost"
              panelId="aside-panel"
            >
              Toggle Aside
            </BaseIdTogglePanelButton>
          </template>

          <template #toolbar-body>
            <div
              v-if="$x.totalResults > 0"
              class="x-list x-list--horizontal x-list--align-center x-list--gap-04"
            >
              <span>{{ $x.totalResults }} Results</span>
              <BaseColumnPickerList
                #default="{ column }"
                v-model="selectedColumns"
                :columns="columnPickerValues"
              >
                <template v-if="column === 0">
                  <ChevronTinyRight />
                  <Grid1Col />
                  <ChevronTinyLeft />
                </template>
                <Grid1Col v-else-if="column === 4" />
                <Grid2Col v-else-if="column === 6" />
              </BaseColumnPickerList>
              <SortDropdown
                :items="sortValues"
                class="x-dropdown--round x-dropdown--right x-dropdown--l"
                :animation="sortDropdownAnimation"
              >
                <template #toggle="{ item }">
                  <span data-test="sort-dropdown-toggle">{{ item || 'default' }}</span>
                  <ChevronTinyDown />
                </template>
                <template #item="{ item, isSelected }">
                  <ChevronTinyRight />
                  <span>{{ item || 'default' }}</span>
                  <CheckTiny v-if="isSelected" />
                </template>
              </SortDropdown>

              <RenderlessExtraParams #default="{ value, updateValue }" name="store">
                <BaseDropdown
                  @change="updateValue"
                  class="x-dropdown x-dropdown--round x-dropdown--right x-dropdown--l"
                  :value="value"
                  :items="stores"
                />
              </RenderlessExtraParams>
            </div>
          </template>

          <template #main-aside>
            <div
              v-if="$x.totalResults > 0"
              class="
                x-list
                x-list--padding-05
                x-list--padding-top
                x-list--gap-06
                x-list--border
                x-list--border-top
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
              <Facets class="x-list--gap-06" renderable-facets="!rootCategories_facet">
                <!--  Hierarchical Facet    -->
                <template #hierarchical-category="{ facet }">
                  <BaseHeaderTogglePanel class="x-facet">
                    <template #header-content>
                      <span class="x-ellipsis">{{ facet.label }}</span>
                      <ChevronDown />
                    </template>
                    <!-- Filters -->
                    <SlicedFilters max="4" :filters="facet.filters">
                      <FiltersList v-slot="{ filter }">
                        <HierarchicalFilter :filter="filter" />
                      </FiltersList>
                    </SlicedFilters>
                  </BaseHeaderTogglePanel>
                </template>

                <!--  Brand Facet    -->
                <template #brand-facet="{ facet }">
                  <BaseHeaderTogglePanel class="x-facet">
                    <template #header-content>
                      <span :data-test="facet.label" class="x-ellipsis">{{ facet.label }}</span>
                      <span data-test="total-filters">{{ facet.filters.length }}</span>
                      <ChevronDown />
                    </template>

                    <!-- Filters -->
                    <ExcludeFiltersWithNoResults :filters="facet.filters">
                      <SortedFilters>
                        <FiltersSearch>
                          <SlicedFilters
                            :max="controls.slicedFilters.max"
                            :data-test="facet.label + '-sliced-filters'"
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
                                data-test="brand-filter"
                              >
                                {{ filter.label }}
                                <span data-test="brand-filter-total-results">
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

                <!--  Default Facet    -->
                <template #default="{ facet }">
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
                          :data-test="facet.label + '-sliced-filters'"
                        >
                          <SelectedFilters :facetId="facet.id" />
                          <FiltersList v-slot="{ filter }">
                            <SimpleFilter :filter="filter" :data-test="facet.label + '-filter'" />
                            <span data-test="filter-total-results">{{ filter.totalResults }}</span>
                          </FiltersList>
                        </SlicedFilters>
                      </SortedFilters>
                    </ExcludeFiltersWithNoResults>
                  </BaseHeaderTogglePanel>
                </template>
              </Facets>
            </div>
          </template>

          <template #main-body>
            <!--  Redirection  -->
            <Redirection
              #default="{ redirection, redirect, abortRedirect, isRedirecting, delayInSeconds }"
              class="x-margin--top-03 x-margin--bottom-03"
              delayInSeconds="5"
            >
              <p>
                Your search matches a special place in our website, to visit it, your are being
                redirected
              </p>
              <a @click="redirect" :href="redirection.url">{{ redirection.url }}</a>
              <div class="x-list x-list--horizontal x-list--gap-07">
                <button
                  @click="abortRedirect"
                  class="x-button x-button--ghost x-font-color--neutral-70"
                >
                  No, I'll stay here
                </button>
                <button @click="redirect" class="x-button x-button--ghost x-font-color--neutral-10">
                  Yes, redirect me
                </button>
              </div>
              <AutoProgressBar :isLoading="isRedirecting" :durationInSeconds="delayInSeconds" />
            </Redirection>

            <template v-if="!$x.redirections.length">
              <!-- IdentifierResults -->
              <IdentifierResults class="x-list x-list--horizontal">
                <template #default="{ identifierResult }">
                  <article class="result">
                    <BaseResultImage :result="identifierResult" class="x-picture--colored">
                      <template #placeholder>
                        <div style="padding-top: 100%; background-color: lightgray"></div>
                      </template>
                      <template #fallback>
                        <div style="padding-top: 100%; background-color: lightsalmon"></div>
                      </template>
                    </BaseResultImage>
                    <h1 class="x-title3" data-test="result-text">{{ identifierResult.name }}</h1>
                  </article>
                </template>
              </IdentifierResults>

              <!--  No Results Message  -->
              <div v-if="$x.noResults" class="x-message x-margin--top-03 x-margin--bottom-03">
                <p>
                  There are no results for
                  <span class="x-font-weight--bold">{{ $x.query.search }}</span>
                </p>
                <p>You may be interested in these:</p>
              </div>

              <!-- Results -->
              <ResultsList v-infinite-scroll:main-scroll>
                <BannersList>
                  <PromotedsList>
                    <NextQueriesList>
                      <BaseVariableColumnGrid :animation="resultsAnimation">
                        <template #result="{ item: result }">
                          <article class="result" style="max-width: 300px">
                            <BaseResultImage :result="result" class="x-picture--colored">
                              <template #placeholder>
                                <div style="padding-top: 100%; background-color: lightgray"></div>
                              </template>
                              <template #fallback>
                                <div
                                  data-test="result-picture-fallback"
                                  style="padding-top: 100%; background-color: lightsalmon"
                                ></div>
                              </template>
                            </BaseResultImage>
                            <h1 class="x-title3" data-test="result-text">{{ result.name }}</h1>
                          </article>
                        </template>

                        <template #banner="{ item: banner }">
                          <Banner :banner="banner" />
                        </template>

                        <template #promoted="{ item: promoted }">
                          <Promoted :promoted="promoted" />
                        </template>

                        <template #next-queries-group="{ item: { nextQueries } }">
                          <div class="x-list x-list--gap-03">
                            <h1 class="x-title2">What's next?</h1>
                            <BaseSuggestions
                              #default="{ suggestion }"
                              :suggestions="nextQueries"
                              class="x-list--gap-03"
                            >
                              <NextQuery
                                #default="{ suggestion: nextQuery }"
                                :suggestion="suggestion"
                              >
                                <Nq1 />
                                {{ nextQuery.query }}
                              </NextQuery>
                            </BaseSuggestions>
                          </div>
                        </template>
                      </BaseVariableColumnGrid>
                    </NextQueriesList>
                  </PromotedsList>
                </BannersList>
              </ResultsList>

              <!-- Partials -->
              <PartialResultsList :animation="resultsAnimation">
                <template #default="{ partialResult }">
                  <span data-test="partial-query">{{ partialResult.query }}</span>
                  <BaseGrid
                    :animation="resultsAnimation"
                    :columns="4"
                    :items="partialResult.results"
                  >
                    <template #result="{ item }">
                      <article class="result" style="max-width: 300px">
                        <BaseResultImage :result="item" class="x-picture--colored">
                          <template #placeholder>
                            <div style="padding-top: 100%; background-color: lightgray"></div>
                          </template>
                          <template #fallback>
                            <div
                              data-test="result-picture-fallback"
                              style="padding-top: 100%; background-color: lightsalmon"
                            ></div>
                          </template>
                        </BaseResultImage>
                        <span class="x-result__title" data-test="partial-result-item">
                          {{ item.name }}
                        </span>
                      </article>
                    </template>
                  </BaseGrid>
                  <PartialQueryButton :query="partialResult.query">
                    <template #default="{ query }">Ver todos {{ query }}</template>
                  </PartialQueryButton>
                </template>
              </PartialResultsList>

              <!-- Recommendations -->
              <Recommendations
                v-if="!$x.query.search || $x.noResults"
                #layout="{ recommendations }"
              >
                <BaseVariableColumnGrid
                  #default="{ item: result }"
                  :animation="resultsAnimation"
                  :items="recommendations"
                >
                  <article class="result" style="max-width: 300px">
                    <BaseResultImage :result="result" class="x-picture--colored">
                      <template #placeholder>
                        <div style="padding-top: 100%; background-color: lightgray"></div>
                      </template>
                      <template #fallback>
                        <div
                          data-test="result-picture-fallback"
                          style="padding-top: 100%; background-color: lightsalmon"
                        ></div>
                      </template>
                    </BaseResultImage>
                    <h1 class="x-title3" data-test="recommendation-item">{{ result.name }}</h1>
                  </article>
                </BaseVariableColumnGrid>
              </Recommendations>
            </template>
          </template>

          <template #scroll-to-top>
            <BaseScrollToTop :threshold-px="500" class="x-button--round" scroll-id="body-scroll">
              <ChevronUp />
            </BaseScrollToTop>
          </template>
        </MultiColumnMaxWidthLayout>
      </BaseEventsModal>
    </BaseKeyboardNavigation>
  </div>
</template>

<script lang="ts">
  import { deepMerge } from '@empathyco/x-deep-merge';
  import { Facet, SimpleFilter as SimpleFilterModel } from '@empathyco/x-types';
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import CollapseFromTop from '../components/animations/collapse-from-top.vue';
  import CollapseHeight from '../components/animations/collapse-height.vue';
  import StaggeredFadeAndSlide from '../components/animations/staggered-fade-and-slide.vue';
  import AutoProgressBar from '../components/auto-progress-bar.vue';
  import BaseDropdown from '../components/base-dropdown.vue';
  import BaseGrid from '../components/base-grid.vue';
  import BaseKeyboardNavigation from '../components/base-keyboard-navigation.vue';
  import BaseVariableColumnGrid from '../components/base-variable-column-grid.vue';
  import BaseColumnPickerList from '../components/column-picker/base-column-picker-list.vue';
  import CheckTiny from '../components/icons/check-tiny.vue';
  import ChevronDown from '../components/icons/chevron-down.vue';
  import ChevronLeft from '../components/icons/chevron-left.vue';
  import ChevronRight from '../components/icons/chevron-right.vue';
  import ChevronTinyDown from '../components/icons/chevron-tiny-down.vue';
  import ChevronTinyLeft from '../components/icons/chevron-tiny-left.vue';
  import ChevronTinyRight from '../components/icons/chevron-tiny-right.vue';
  import ChevronUp from '../components/icons/chevron-up.vue';
  import CrossTinyIcon from '../components/icons/cross-tiny.vue';
  import CrossIcon from '../components/icons/cross.vue';
  import Grid1Col from '../components/icons/grid-1-col.vue';
  import Grid2Col from '../components/icons/grid-2-col.vue';
  import Nq1 from '../components/icons/nq-1.vue';
  import SearchIcon from '../components/icons/search.vue';
  import MultiColumnMaxWidthLayout from '../components/layouts/multi-column-max-width-layout.vue';
  import BaseEventsModalClose from '../components/modals/base-events-modal-close.vue';
  import BaseEventsModalOpen from '../components/modals/base-events-modal-open.vue';
  import BaseEventsModal from '../components/modals/base-events-modal.vue';
  import BaseHeaderTogglePanel from '../components/panels/base-header-toggle-panel.vue';
  import BaseIdTogglePanelButton from '../components/panels/base-id-toggle-panel-button.vue';
  import BaseIdTogglePanel from '../components/panels/base-id-toggle-panel.vue';
  import BaseResultImage from '../components/result/base-result-image.vue';
  import BaseResultLink from '../components/result/base-result-link.vue';
  import BaseScrollToTop from '../components/scroll/base-scroll-to-top.vue';
  import SlidingPanel from '../components/sliding-panel.vue';
  import BaseSuggestions from '../components/suggestions/base-suggestions.vue';
  import { infiniteScroll } from '../directives/infinite-scroll/infinite-scroll';
  import { XEvent } from '../wiring';
  import { XInstaller } from '../x-installer/x-installer';
  import Empathize from '../x-modules/empathize/components/empathize.vue';
  import ExtraParams from '../x-modules/extra-params/components/extra-params.vue';
  // eslint-disable-next-line max-len
  import RenderlessExtraParams from '../x-modules/extra-params/components/renderless-extra-param.vue';
  // eslint-disable-next-line max-len
  import SnippetConfigExtraParams from '../x-modules/extra-params/components/snippet-config-extra-params.vue';
  import ClearFilters from '../x-modules/facets/components/clear-filters.vue';
  import FacetsProvider from '../x-modules/facets/components/facets/facets-provider.vue';
  import Facets from '../x-modules/facets/components/facets/facets.vue';
  import HierarchicalFilter from '../x-modules/facets/components/filters/hierarchical-filter.vue';
  import SimpleFilter from '../x-modules/facets/components/filters/simple-filter.vue';
  // eslint-disable-next-line max-len
  import ExcludeFiltersWithNoResults from '../x-modules/facets/components/lists/exclude-filters-with-no-results.vue';
  import FiltersList from '../x-modules/facets/components/lists/filters-list.vue';
  import FiltersSearch from '../x-modules/facets/components/lists/filters-search.vue';
  import SelectedFiltersList from '../x-modules/facets/components/lists/selected-filters-list.vue';
  import SelectedFilters from '../x-modules/facets/components/lists/selected-filters.vue';
  import SlicedFilters from '../x-modules/facets/components/lists/sliced-filters.vue';
  import SortedFilters from '../x-modules/facets/components/lists/sorted-filters.vue';
  import { FilterEntityFactory } from '../x-modules/facets/entities/filter-entity.factory';
  import { SingleSelectModifier } from '../x-modules/facets/entities/single-select.modifier';
  // eslint-disable-next-line max-len
  import ClearHistoryQueries from '../x-modules/history-queries/components/clear-history-queries.vue';
  import HistoryQueries from '../x-modules/history-queries/components/history-queries.vue';
  import IdentifierResult from '../x-modules/identifier-results/components/identifier-result.vue';
  import IdentifierResults from '../x-modules/identifier-results/components/identifier-results.vue';
  import { NextQuery } from '../x-modules/next-queries';
  import NextQueriesList from '../x-modules/next-queries/components/next-queries-list.vue';
  import NextQueries from '../x-modules/next-queries/components/next-queries.vue';
  import PopularSearches from '../x-modules/popular-searches/components/popular-searches.vue';
  import QuerySuggestions from '../x-modules/query-suggestions/components/query-suggestions.vue';
  import Recommendations from '../x-modules/recommendations/components/recommendations.vue';
  import RelatedTags from '../x-modules/related-tags/components/related-tags.vue';
  import ClearSearchInput from '../x-modules/search-box/components/clear-search-input.vue';
  import SearchButton from '../x-modules/search-box/components/search-button.vue';
  import SearchInput from '../x-modules/search-box/components/search-input.vue';
  import Banner from '../x-modules/search/components/banner.vue';
  import BannersList from '../x-modules/search/components/banners-list.vue';
  import PartialQueryButton from '../x-modules/search/components/partial-query-button.vue';
  import PartialResultsList from '../x-modules/search/components/partial-results-list.vue';
  import Promoted from '../x-modules/search/components/promoted.vue';
  import PromotedsList from '../x-modules/search/components/promoteds-list.vue';
  import Redirection from '../x-modules/search/components/redirection.vue';
  import ResultsList from '../x-modules/search/components/results-list.vue';
  import SortDropdown from '../x-modules/search/components/sort-dropdown.vue';
  import SortList from '../x-modules/search/components/sort-list.vue';
  import SpellcheckButton from '../x-modules/search/components/spellcheck-button.vue';
  import Spellcheck from '../x-modules/search/components/spellcheck.vue';
  import UrlHandler from '../x-modules/url/components/url-handler.vue';
  import { baseInstallXOptions, baseSnippetConfig } from './base-config';

  @Component({
    beforeRouteEnter(to, _from, next: () => void): void {
      let customQueryConfig = JSON.parse(to.query.xModules?.toString() ?? '{}');
      const configLayoutView = deepMerge(baseInstallXOptions, {
        xModules: deepMerge(customQueryConfig)
      });
      new XInstaller(configLayoutView).init(baseSnippetConfig);
      ['hierarchical_category', 'brand_facet', 'age_facet'].forEach(facetId =>
        FilterEntityFactory.instance.registerFilterModifier(facetId, [SingleSelectModifier])
      );
      next();
    },
    directives: {
      infiniteScroll
    },
    components: {
      AutoProgressBar,
      Banner,
      BannersList,
      BaseColumnPickerList,
      BaseDropdown,
      BaseEventsModal,
      BaseEventsModalClose,
      BaseEventsModalOpen,
      BaseGrid,
      BaseHeaderTogglePanel,
      BaseIdTogglePanel,
      BaseIdTogglePanelButton,
      BaseKeyboardNavigation,
      BaseResultImage,
      BaseResultLink,
      BaseScrollToTop,
      BaseSuggestions,
      BaseVariableColumnGrid,
      CheckTiny,
      ChevronDown,
      ChevronLeft,
      ChevronRight,
      ChevronTinyDown,
      ChevronTinyLeft,
      ChevronTinyRight,
      ChevronUp,
      ClearFilters,
      ClearHistoryQueries,
      ClearSearchInput,
      CrossIcon,
      CrossTinyIcon,
      Empathize,
      ExcludeFiltersWithNoResults,
      ExtraParams,
      Facets,
      FacetsProvider,
      FiltersList,
      FiltersSearch,
      Grid1Col,
      Grid2Col,
      HierarchicalFilter,
      HistoryQueries,
      IdentifierResult,
      IdentifierResults,
      MultiColumnMaxWidthLayout,
      NextQueries,
      NextQueriesList,
      NextQuery,
      Nq1,
      PartialQueryButton,
      PartialResultsList,
      PopularSearches,
      Promoted,
      PromotedsList,
      QuerySuggestions,
      Recommendations,
      Redirection,
      RelatedTags,
      RenderlessExtraParams,
      ResultsList,
      SearchButton,
      SearchIcon,
      SearchInput,
      SelectedFilters,
      SelectedFiltersList,
      SimpleFilter,
      SlicedFilters,
      SlidingPanel,
      SnippetConfigExtraParams,
      SortDropdown,
      SortList,
      SortedFilters,
      Spellcheck,
      SpellcheckButton,
      UrlHandler
    }
  })
  export default class App extends Vue {
    protected stores = ['Spain', 'Portugal', 'Italy'];
    protected initialExtraParams = { store: 'Portugal' };
    protected columnPickerValues = [0, 4, 6];
    protected resultsAnimation = StaggeredFadeAndSlide;
    protected empathizeAnimation = CollapseFromTop;
    protected sortDropdownAnimation = CollapseHeight;
    protected selectedColumns = 4;
    protected sortValues = ['', 'priceSort asc', 'priceSort desc'];
    protected controls = {
      searchInput: {
        instant: true,
        instantDebounceInMs: 500 // default
      },
      popularSearches: {
        maxItemsToRender: 10
      },
      slicedFilters: {
        max: 4
      },
      historyQueries: {
        maxItemsToRender: 5
      }
    };
    protected eventsToOpenModal: XEvent[] = [
      'UserClickedOpenEventsModal',
      'UserOpenXProgrammatically'
    ];
    protected staticFacets: Facet[] = [
      {
        modelName: 'SimpleFacet',
        label: 'offer',
        id: 'offer',
        filters: [
          {
            facetId: 'offer',
            modelName: 'SimpleFilter',
            id: 'priceSort:[0 TO 10]',
            selected: false,
            label: 'In Offer'
          } as SimpleFilterModel
        ]
      }
    ];
  }
</script>

<style lang="scss" scoped>
  .x-modal::v-deep .x-modal__content {
    overflow: hidden;
    width: 100%;
    height: 99%;
  }
</style>
