<template>
  <div class="x">
    <Tagging :consent="false" />
    <SnippetConfigExtraParams :values="initialExtraParams" />
    <PreselectedFilters />
    <UrlHandler query="q" store="store" />
    <SnippetCallbacks />
    <OpenMainModal>Start</OpenMainModal>
    <h1 class="x-font-bold x-text-4xl x-text-primary-50 x-leading-md">Test controls</h1>
    <ul class="x-test-controls x-list x-list--gap-05">
      <li class="x-test-controls__item x-list__item">
        <label for="searchInput.instant">
          search-input - instant
          <input
            v-model="controls.searchInput.instant"
            id="searchInput.instant"
            type="checkbox"
            data-test="search-input-instant"
          />
        </label>
      </li>
      <li class="x-test-controls__item x-list__item">
        <label for="searchInput.instantDebounceInMs">
          search-input - debounce
          <input
            v-model="controls.searchInput.instantDebounceInMs"
            id="searchInput.instantDebounceInMs"
            type="number"
            data-test="search-input-debounce"
          />
        </label>
      </li>
      <li class="x-test-controls__item x-list__item">
        <label for="popularSearches.maxItemsToRender">
          popular-searches - maxItemsToRender
          <input
            v-model="controls.popularSearches.maxItemsToRender"
            id="popularSearches.maxItemsToRender"
            type="number"
            data-test="popular-searches-max-to-render"
          />
        </label>
      </li>
      <li class="x-test-controls__item x-list__item">
        <label for="slicedFilters.max">
          sliced-filters - max
          <input
            v-model="controls.slicedFilters.max"
            id="slicedFilters.max"
            type="number"
            data-test="sliced-filters-max"
          />
        </label>
      </li>
      <li class="x-test-controls__item x-list__item">
        <label for="historyQueries.maxItemsToRender">
          history-queries - maxItemsToRender
          <input
            v-model="controls.historyQueries.maxItemsToRender"
            id="historyQueries.maxItemsToRender"
            type="number"
            data-test="history-queries-max-to-render"
          />
        </label>
      </li>
    </ul>
    <MainModal :animation="modalAnimation">
      <MultiColumnMaxWidthLayout class="x-background--neutral-100">
        <template #header-middle>
          <div
            class="
              x-list x-list--vertical x-list--gap-05 x-list--align-stretch x-list__item--expand
            "
          >
            <BaseKeyboardNavigation>
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
            </BaseKeyboardNavigation>

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
          <CloseMainModal class="x-button x-button--ghost">
            <CrossIcon />
          </CloseMainModal>
        </template>

        <template #sub-header>
          <PredictiveLayer :controls="controls" />
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
                data-test="store-selector"
                :value="value"
                :items="stores"
              />
            </RenderlessExtraParams>
          </div>
        </template>

        <template #main-aside>
          <Aside v-if="$x.totalResults > 0" />
        </template>

        <template #main-body>
          <!--  Redirection  -->
          <Redirection
            #default="{ redirection, redirect, abortRedirect, isRedirecting, delayInSeconds }"
            class="x-margin--top-03 x-margin--bottom-03"
            :delayInSeconds="5"
          >
            <p>Your search matches a special place in our website. You are being redirected to:</p>
            <a @click="redirect" :href="redirection.url" data-test="redirection-link">
              {{ redirection.url }}
            </a>
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
            <!--  No Results Message  -->
            <div v-if="$x.noResults" class="x-message x-margin--top-03 x-margin--bottom-03">
              <p>
                There are no results for
                <span class="x-font-weight--bold">{{ $x.query.search }}</span>
              </p>
              <p>You may be interested in these:</p>
            </div>

            <template v-if="!$x.query.searchBox">
              <h1 class="x-title1 x-margin--bottom-06">Discovery wall</h1>

              <SlidingQueryPreview query="sunglasses" />
              <SlidingQueryPreview query="handbag" />
              <SlidingQueryPreview query="earrings" />
            </template>

            <!-- Results -->
            <LocationProvider location="results">
              <ResultsList v-infinite-scroll:main-scroll>
                <BannersList>
                  <PromotedsList>
                    <NextQueriesList>
                      <BaseVariableColumnGrid :animation="resultsAnimation">
                        <template #result="{ item: result }">
                          <MainScrollItem :item="result">
                            <Result :result="result" data-test="search-result" />
                          </MainScrollItem>
                        </template>

                        <template #banner="{ item: banner }">
                          <Banner :banner="banner" />
                        </template>

                        <template #promoted="{ item: promoted }">
                          <Promoted :promoted="promoted" />
                        </template>

                        <template #next-queries-group="{ item: { nextQueries } }">
                          <div class="x-row x-row--gap-04 x-row--align-stretch">
                            <div
                              class="
                                x-row__item x-row__item--span-3
                                x-list
                                x-padding--06
                                x-background--neutral-95
                                x-list--gap-06
                              "
                            >
                              <div class="x-list x-list--gap-03">
                                <h1 class="x-title2 x-text--bold">You may be interested</h1>
                                <p class="x-text x-font-size--05">
                                  This is what other shoppers searched after
                                  <span class="x-font-weight--bold">"{{ $x.query.search }}"</span>
                                </p>
                              </div>
                              <NextQueries
                                #suggestion="{ suggestion }"
                                :suggestions="nextQueries"
                                class="x-list--gap-06"
                                :max-items-to-render="3"
                              >
                                <NextQuery
                                  #default="{ suggestion: nextQuery }"
                                  :suggestion="suggestion"
                                  class="x-tag x-tag--card"
                                >
                                  <LightBulbOn class="x-icon--l" />
                                  <span class="x-flex-auto">{{ nextQuery.query }}</span>
                                  <ArrowRight class="x-icon--l" />
                                </NextQuery>
                              </NextQueries>
                            </div>
                            <SlidingNextQueryPreview
                              :suggestion="nextQueries[0]"
                              class="x-row__item x-row__item--span-9 x-padding--top-06"
                            />
                          </div>
                        </template>
                      </BaseVariableColumnGrid>
                    </NextQueriesList>
                  </PromotedsList>
                </BannersList>
              </ResultsList>
            </LocationProvider>

            <!-- Partials -->
            <PartialResultsList :animation="resultsAnimation">
              <template #default="{ partialResult }">
                <span data-test="partial-query">{{ partialResult.query }}</span>
                <BaseGrid
                  #result="{ item }"
                  :animation="resultsAnimation"
                  :columns="4"
                  :items="partialResult.results"
                >
                  <Result :result="item" data-test="partial-result-item" />
                </BaseGrid>
                <PartialQueryButton :query="partialResult.query">
                  <template #default="{ query }">Ver todos {{ query }}</template>
                </PartialQueryButton>
              </template>
            </PartialResultsList>

            <!-- Recommendations -->
            <Recommendations v-if="!$x.query.search || $x.noResults" #layout="{ recommendations }">
              <BaseVariableColumnGrid
                #default="{ item: result }"
                :animation="resultsAnimation"
                :items="recommendations"
              >
                <Result :result="result" data-test="recommendation-item" />
              </BaseVariableColumnGrid>
            </Recommendations>
          </template>
        </template>

        <template #scroll-to-top>
          <ScrollToTop :threshold-px="500" class="x-button--round" scroll-id="main-scroll">
            <ChevronUp />
          </ScrollToTop>
        </template>
      </MultiColumnMaxWidthLayout>
    </MainModal>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  // eslint-disable-next-line max-len
  import { animateClipPath } from '../../components/animations/animate-clip-path/animate-clip-path.factory';
  import CollapseHeight from '../../components/animations/collapse-height.vue';
  import StaggeredFadeAndSlide from '../../components/animations/staggered-fade-and-slide.vue';
  import AutoProgressBar from '../../components/auto-progress-bar.vue';
  import BaseDropdown from '../../components/base-dropdown.vue';
  import BaseGrid from '../../components/base-grid.vue';
  import BaseVariableColumnGrid from '../../components/base-variable-column-grid.vue';
  import BaseColumnPickerList from '../../components/column-picker/base-column-picker-list.vue';
  import ArrowRight from '../../components/icons/arrow-right.vue';
  import CheckTiny from '../../components/icons/check-tiny.vue';
  import ChevronLeft from '../../components/icons/chevron-left.vue';
  import ChevronRight from '../../components/icons/chevron-right.vue';
  import ChevronTinyDown from '../../components/icons/chevron-tiny-down.vue';
  import ChevronTinyLeft from '../../components/icons/chevron-tiny-left.vue';
  import ChevronTinyRight from '../../components/icons/chevron-tiny-right.vue';
  import ChevronUp from '../../components/icons/chevron-up.vue';
  import CrossIcon from '../../components/icons/cross.vue';
  import Grid1Col from '../../components/icons/grid-1-col.vue';
  import Grid2Col from '../../components/icons/grid-2-col.vue';
  import LightBulbOn from '../../components/icons/light-bulb-on.vue';
  import Nq1 from '../../components/icons/nq-1.vue';
  import SearchIcon from '../../components/icons/search.vue';
  import BaseEventButton from '../../components/base-event-button.vue';
  // eslint-disable-next-line max-len
  import MultiColumnMaxWidthLayout from '../../components/layouts/multi-column-max-width-layout.vue';
  import LocationProvider from '../../components/location-provider.vue';
  import BaseIdTogglePanelButton from '../../components/panels/base-id-toggle-panel-button.vue';
  import BaseIdTogglePanel from '../../components/panels/base-id-toggle-panel.vue';
  import PreselectedFilters from '../../x-modules/facets/components/preselected-filters.vue';
  import BaseResultImage from '../../components/result/base-result-image.vue';
  import SlidingPanel from '../../components/sliding-panel.vue';
  import SnippetCallbacks from '../../components/snippet-callbacks.vue';
  import BaseSuggestions from '../../components/suggestions/base-suggestions.vue';
  import { infiniteScroll } from '../../directives/infinite-scroll/infinite-scroll';
  // eslint-disable-next-line max-len
  import RenderlessExtraParams from '../../x-modules/extra-params/components/renderless-extra-param.vue';
  // eslint-disable-next-line max-len
  import SnippetConfigExtraParams from '../../x-modules/extra-params/components/snippet-config-extra-params.vue';
  import NextQueriesList from '../../x-modules/next-queries/components/next-queries-list.vue';
  import NextQueries from '../../x-modules/next-queries/components/next-queries.vue';
  import { NextQuery } from '../../x-modules/next-queries/index';
  import Recommendations from '../../x-modules/recommendations/components/recommendations.vue';
  import RelatedTags from '../../x-modules/related-tags/components/related-tags.vue';
  import MainScrollItem from '../../x-modules/scroll/components/main-scroll-item.vue';
  import ScrollToTop from '../../x-modules/scroll/components/scroll-to-top.vue';
  import ClearSearchInput from '../../x-modules/search-box/components/clear-search-input.vue';
  import SearchButton from '../../x-modules/search-box/components/search-button.vue';
  import SearchInput from '../../x-modules/search-box/components/search-input.vue';
  import Banner from '../../x-modules/search/components/banner.vue';
  import BannersList from '../../x-modules/search/components/banners-list.vue';
  import PartialQueryButton from '../../x-modules/search/components/partial-query-button.vue';
  import PartialResultsList from '../../x-modules/search/components/partial-results-list.vue';
  import Promoted from '../../x-modules/search/components/promoted.vue';
  import PromotedsList from '../../x-modules/search/components/promoteds-list.vue';
  import Redirection from '../../x-modules/search/components/redirection.vue';
  import ResultsList from '../../x-modules/search/components/results-list.vue';
  import SortDropdown from '../../x-modules/search/components/sort-dropdown.vue';
  import SortList from '../../x-modules/search/components/sort-list.vue';
  import SpellcheckButton from '../../x-modules/search/components/spellcheck-button.vue';
  import Spellcheck from '../../x-modules/search/components/spellcheck.vue';
  import Tagging from '../../x-modules/tagging/components/tagging.vue';
  import UrlHandler from '../../x-modules/url/components/url-handler.vue';
  import MainModal from '../../components/modals/main-modal.vue';
  import OpenMainModal from '../../components/modals/open-main-modal.vue';
  import CloseMainModal from '../../components/modals/close-main-modal.vue';
  import BaseKeyboardNavigation from '../../components/base-keyboard-navigation.vue';
  import { XProvide } from '../../components/decorators/injection.decorators';
  import Aside from './aside.vue';
  import PredictiveLayer from './predictive-layer.vue';
  import Result from './result.vue';
  import { HomeControls } from './types';
  import SlidingNextQueryPreview from './sliding-next-query-preview.vue';
  import SlidingQueryPreview from './sliding-query-preview.vue';

  @Component({
    directives: {
      infiniteScroll
    },
    components: {
      ArrowRight,
      Aside,
      AutoProgressBar,
      Banner,
      BannersList,
      BaseColumnPickerList,
      BaseDropdown,
      BaseEventButton,
      BaseGrid,
      BaseIdTogglePanel,
      BaseIdTogglePanelButton,
      BaseKeyboardNavigation,
      BaseResultImage,
      BaseSuggestions,
      BaseVariableColumnGrid,
      CheckTiny,
      ChevronLeft,
      ChevronRight,
      ChevronTinyDown,
      ChevronTinyLeft,
      ChevronTinyRight,
      ChevronUp,
      ClearSearchInput,
      CloseMainModal,
      CrossIcon,
      Grid1Col,
      Grid2Col,
      LightBulbOn,
      LocationProvider,
      MainScrollItem,
      MultiColumnMaxWidthLayout,
      NextQueries,
      NextQueriesList,
      NextQuery,
      Nq1,
      OpenMainModal,
      PartialQueryButton,
      PartialResultsList,
      PredictiveLayer,
      PreselectedFilters,
      Promoted,
      PromotedsList,
      Recommendations,
      Redirection,
      RelatedTags,
      RenderlessExtraParams,
      Result,
      ResultsList,
      ScrollToTop,
      SearchButton,
      SearchIcon,
      SearchInput,
      SlidingNextQueryPreview,
      SlidingPanel,
      SlidingQueryPreview,
      SnippetCallbacks,
      SnippetConfigExtraParams,
      SortDropdown,
      SortList,
      Spellcheck,
      SpellcheckButton,
      Tagging,
      UrlHandler,
      MainModal
    }
  })
  export default class App extends Vue {
    protected stores = ['Spain', 'Portugal', 'Italy'];
    protected initialExtraParams = { store: 'Portugal' };
    protected columnPickerValues = [0, 4, 6];
    protected resultsAnimation = StaggeredFadeAndSlide;
    protected modalAnimation = animateClipPath();
    protected sortDropdownAnimation = CollapseHeight;
    protected selectedColumns = 4;
    protected sortValues = ['', 'price asc', 'price desc'];

    @XProvide('controls')
    public controls: HomeControls = {
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
  }
</script>

<style lang="scss" scoped>
  .x-modal::v-deep .x-modal__content {
    overflow: hidden;
    // Following is needed for closing the modal in base-events-modal.feature
    width: calc(100% - 20px);
    height: calc(100% - 20px);
    margin: 10px;
  }
</style>
