<template>
  <div class="x x-text-neutral-90">
    <Tagging :consent="false" />
    <SnippetConfigExtraParams :values="initialExtraParams" />
    <PreselectedFilters />
    <UrlHandler query="q" store="store" />
    <SnippetCallbacks />
    <ExperienceControls />
    <OpenMainModal>Start</OpenMainModal>
    <h1 class="x-text-primary-50 x-text-4xl x-font-bold x-leading-[1.5]">Test controls</h1>
    <ul class="x-test-controls x-flex x-flex-col x-gap-16">
      <li class="x-test-controls__item">
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
      <li class="x-test-controls__item">
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
      <li class="x-test-controls__item">
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
      <li class="x-test-controls__item">
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
      <li class="x-test-controls__item">
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
      <li class="x-test-controls__item">
        <label for="nextQueriesPreview.maxItemsToRender">
          next-queries-preview - maxItemsToRender
          <input
            v-model="controls.nextQueriesPreview.maxItemsToRender"
            id="nextQueriesPreview.maxItemsToRender"
            type="number"
            data-test="nq-preview-max-to-render"
          />
        </label>
      </li>
      <li class="x-test-controls__item">
        <label for="nextQueriesPreview.maxItemsToRender">
          next-queries-list - showOnlyAfterOffset
          <input
            v-model="controls.nextQueriesList.showOnlyAfterOffset"
            id="nextQueriesList.showOnlyAfterOffset"
            type="checkbox"
            data-test="nq-preview-show-after-offset"
          />
        </label>
      </li>
      <li class="x-test-controls__item">
        <label for="adapter.e2eAdapter">
          Use mocked adapter
          <input
            v-model="controls.adapter.useE2EAdapter"
            @change="toggleE2EAdapter"
            id="adapter.e2eAdapter"
            type="checkbox"
            data-test="adapter-e2e"
          />
        </label>
      </li>
    </ul>
    <MainModal :animation="modalAnimation">
      <MultiColumnMaxWidthLayout class="x-bg-neutral-0">
        <template #header-middle>
          <div class="x-flex x-flex-col x-gap-16 x-items-stretch x-flex-auto">
            <div class="x-input-group x-input-group-lead x-rounded-sm">
              <div class="x-input x-search-input-placeholder-container x-flex">
                <SearchInputPlaceholder :messages="searchInputPlaceholderMessages" />
                <SearchInput
                  aria-label="Search for products"
                  :instant="controls.searchInput.instant"
                  :instant-debounce-in-ms="controls.searchInput.instantDebounceInMs"
                />
              </div>
              <ClearSearchInput
                class="x-input-group-button x-input-group-button-rectangle"
                aria-label="Clear query"
              >
                Clear
              </ClearSearchInput>
              <SearchButton aria-label="Search" class="x-input-group-button-primary">
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

            <!-- Related Tags -->
            <SlidingPanel v-if="x.relatedTags.length">
              <template #sliding-panel-left-button>
                <ChevronLeft />
              </template>
              <RelatedTags class="x-gap-8" itemClass="x-tag-outlined" />
              <template #sliding-panel-right-button>
                <ChevronRight />
              </template>
            </SlidingPanel>
          </div>
        </template>

        <template #header-end>
          <CloseMainModal class="x-button--ghost x-button">
            <CrossIcon />
          </CloseMainModal>
        </template>

        <template #sub-header>
          <PredictiveLayer :controls="controls" />
        </template>

        <template #toolbar-aside>
          <BaseIdTogglePanelButton
            v-if="x.totalResults > 0"
            class="x-button--ghost x-button"
            panelId="aside-panel"
          >
            Toggle Aside
          </BaseIdTogglePanelButton>
        </template>

        <template #toolbar-body>
          <div v-if="x.totalResults > 0" class="x-flex x-items-center x-gap-12">
            <span class="x-text1">{{ x.totalResults }} Results</span>
            <BaseColumnPickerList
              @update:modelValue="col => (selectedColumns = col)"
              :modelValue="selectedColumns"
              class="x-gap-4"
              :columns="columnPickerValues"
            >
              <template #default="{ column }">
                <span v-if="column === 0">Auto</span>
                <Grid2Col v-else-if="column === 2" />
                <Grid4Col v-else-if="column === 4" />
              </template>

              <template #divider>
                <span class="x-button-group-divider"></span>
              </template>
            </BaseColumnPickerList>
            <SortPickerList
              :items="sortValues"
              class="x-button-group"
              buttonClass="x-button x-button-outlined"
              #default="{ item }"
            >
              {{ item || 'default' }}
            </SortPickerList>

            <RenderlessExtraParams #default="{ value, updateValue }" name="store">
              <BaseDropdown
                @update:modelValue="updateValue"
                :modelValue="value"
                :items="stores"
                class="x-dropdown x-dropdown--round x-dropdown--right x-dropdown--l"
                data-test="store-selector"
              />
            </RenderlessExtraParams>
          </div>
        </template>

        <template #main-aside>
          <Aside v-if="x.totalResults > 0" />
        </template>

        <template #main-body>
          <!--  Redirection  -->
          <Redirection
            #default="{ redirection, redirect, abortRedirect, isRedirecting, delayInSeconds }"
            class="x-p-28 x-flex x-flex-col x-gap-8 x-items-center x-bg-lead-25 x-my-8"
            :delayInSeconds="5"
          >
            <p>Your search matches a special place in our website. You are being redirected to:</p>
            <a @click="redirect" :href="redirection.url" data-test="redirection-link">
              {{ redirection.url }}
            </a>
            <div class="x-flex x-gap-32">
              <button @click="abortRedirect" class="x-button--ghost x-button x-text-neutral-25">
                No, I'll stay here
              </button>
              <button @click="redirect" class="x-button--ghost x-button x-text-neutral-90">
                Yes, redirect me
              </button>
            </div>
            <AutoProgressBar :isLoading="isRedirecting" :durationInSeconds="delayInSeconds" />
          </Redirection>

          <template v-if="!x.redirections.length">
            <FallbackDisclaimer class="x-message" />

            <!--  No Results Message  -->
            <div
              v-if="x.noResults && !x.fromNoResultsWithFilters"
              class="x-p-28 x-flex x-flex-col x-gap-8 x-items-center x-bg-lead-25 x-my-8"
              data-test="no-results-message"
            >
              <p>
                There are no results for
                <span class="x-font-bold">{{ x.query.search }}</span>
              </p>
              <p>You may be interested in these:</p>
            </div>

            <template v-if="!x.query.searchBox">
              <!-- Brand Recommendations -->
              <h1 class="x-mb-16 x-title1">Brand Recommendations</h1>
              <LocationProvider location="no_results">
                <QueryPreviewList
                  :debounceTimeMs="250"
                  :queriesPreviewInfo="queriesPreviewInfo"
                  data-wysiwyg="query-preview-list"
                  #default="{
                    queryPreviewInfo,
                    totalResults,
                    results,
                    displayTagging,
                    queryTagging
                  }"
                  data-test="brand-recommendations-list"
                  :persistInCache="true"
                >
                  <DisplayEmitter
                    :payload="displayTagging"
                    :eventMetadata="{ feature: 'customer' }"
                  >
                    <div class="x-flex x-flex-col x-gap-8 x-mb-16">
                      <QueryPreviewButton
                        class="x-w-fit x-button-xl x-button-ghost"
                        :queryPreviewInfo="queryPreviewInfo"
                      >
                        {{ `${queryPreviewInfo.query} (${totalResults})` }}
                      </QueryPreviewButton>
                      <DisplayResultProvider :queryTagging="queryTagging">
                        <SlidingPanel :resetOnContentChange="false">
                          <div class="x-flex x-gap-8">
                            <Result
                              v-for="result in results"
                              :key="result.id"
                              :result="result"
                              style="max-width: 180px"
                            />
                          </div>
                        </SlidingPanel>
                      </DisplayResultProvider>
                    </div>
                  </DisplayEmitter>
                </QueryPreviewList>
              </LocationProvider>
            </template>

            <!-- Results -->
            <LocationProvider location="results">
              <ResultsList
                v-infinite-scroll:main-scroll="{ margin: 600 }"
                class="x-mot-results-list"
                data-test="results-list"
                data-wysiwyg="results"
              >
                <PromotedsList class="x-mot-promoteds-list">
                  <BannersList class="x-mot-banners-list">
                    <NextQueriesList
                      :show-only-after-offset="controls.nextQueriesList.showOnlyAfterOffset"
                      class="x-mot-next-queries-list"
                    >
                      <BaseVariableColumnGrid
                        style="--x-size-min-width-grid-item: 150px"
                        class="x-gap-12"
                        :animation="resultsAnimation"
                        :columns="x.device === 'mobile' ? 2 : 4"
                      >
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
                          <NextQueryPreview
                            :suggestion="nextQueries[0]"
                            :max-items-to-render="controls.nextQueriesPreview.maxItemsToRender"
                            #default="{ results }"
                            class="x-pt-24"
                          >
                            <h1 class="x-title2">Others clients have searched</h1>
                            <NextQuery
                              class="x-suggestion x-text1 x-text1-lg"
                              :suggestion="nextQueries[0]"
                              data-test="next-query-preview-name"
                            >
                              <span class="x-font-bold">{{ nextQueries[0].query }}</span>
                            </NextQuery>
                            <div class="x-mb-24">
                              <SlidingPanel :resetOnContentChange="false">
                                <div class="x-flex x-flex-row x-gap-8">
                                  <Result
                                    v-for="result in results"
                                    :key="result.id"
                                    :result="result"
                                    style="max-width: 180px"
                                    data-test="next-query-preview-result"
                                  />
                                </div>
                              </SlidingPanel>
                            </div>
                            <NextQuery
                              :suggestion="nextQueries[0]"
                              data-test="view-all-results"
                              class="x-button x-button-outlined x-rounded-full x-mx-auto x-mt-8 x-mb-24"
                            >
                              {{ 'View all results' }}
                            </NextQuery>
                          </NextQueryPreview>
                        </template>
                      </BaseVariableColumnGrid>
                    </NextQueriesList>
                  </BannersList>
                </PromotedsList>
              </ResultsList>
            </LocationProvider>

            <!-- Semantic Queries -->
            <SemanticQueries #default="{ queries, findSemanticQuery }">
              <section class="x-mt-28">
                <h1 v-if="isAnyQueryLoadedInPreview(queries)" class="x-title1">
                  Similar Semantic Queries
                </h1>
                <LocationProvider :location="x.noResults ? 'no_results' : 'low_results'">
                  <QueryPreviewList
                    :queries-preview-info="queries.map(q => ({ query: q }))"
                    #default="{ queryPreviewInfo: { query }, results, queryTagging }"
                    queryFeature="semantics"
                  >
                    <div
                      class="x-flex x-flex-col x-gap-8 x-mb-16"
                      data-test="semantic-query-preview"
                      :data-query="query"
                    >
                      <SemanticQuery
                        class="x-suggestion x-title2 x-title2-md"
                        :suggestion="findSemanticQuery(query)"
                        #default="{ suggestion: { query } }"
                      >
                        <span data-test="semantic-queries-query">{{ query }}</span>
                      </SemanticQuery>
                      <DisplayResultProvider :queryTagging="queryTagging">
                        <SlidingPanel :resetOnContentChange="false">
                          <div class="x-flex x-gap-8">
                            <Result
                              v-for="result in results"
                              :key="result.id"
                              :result="result"
                              style="max-width: 180px"
                              data-test="semantic-query-result"
                            />
                          </div>
                        </SlidingPanel>
                      </DisplayResultProvider>
                    </div>
                  </QueryPreviewList>
                </LocationProvider>
              </section>
            </SemanticQueries>

            <!-- Partials -->
            <PartialResultsList
              v-if="!x.fromNoResultsWithFilters && (x.totalResults <= 4 || x.noResults)"
              :animation="resultsAnimation"
            >
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
            <Recommendations v-if="!x.query.search || x.noResults" #layout="{ recommendations }">
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
  /* eslint-disable max-len */
  import { computed, ComputedRef, defineComponent, provide } from 'vue';
  import { animateClipPath } from '../../components/animations/animate-clip-path/animate-clip-path.factory';
  // import StaggeredFadeAndSlide from '../../components/animations/staggered-fade-and-slide.vue';
  import AutoProgressBar from '../../components/auto-progress-bar.vue';
  import BaseDropdown from '../../components/base-dropdown.vue';
  import BaseGrid from '../../components/base-grid.vue';
  import BaseVariableColumnGrid from '../../components/base-variable-column-grid.vue';
  import BaseColumnPickerList from '../../components/column-picker/base-column-picker-list.vue';
  import ChevronLeft from '../../components/icons/chevron-left.vue';
  import ChevronRight from '../../components/icons/chevron-right.vue';
  import ChevronUp from '../../components/icons/chevron-up.vue';
  import CrossIcon from '../../components/icons/cross.vue';
  import { use$x } from '../../composables/use-$x';
  import { infiniteScroll } from '../../directives/infinite-scroll';
  import ExperienceControls from '../../x-modules/experience-controls/components/experience-controls.vue';
  import Grid2Col from '../../components/icons/grid-2-col.vue';
  import Grid4Col from '../../components/icons/grid-4-col.vue';
  import SearchIcon from '../../components/icons/search.vue';
  import MultiColumnMaxWidthLayout from '../../components/layouts/multi-column-max-width-layout.vue';
  import LocationProvider from '../../components/location-provider.vue';
  import BaseIdTogglePanelButton from '../../components/panels/base-id-toggle-panel-button.vue';
  import PreselectedFilters from '../../x-modules/facets/components/preselected-filters.vue';
  import SlidingPanel from '../../components/sliding-panel.vue';
  import SnippetCallbacks from '../../components/snippet-callbacks.vue';
  import RenderlessExtraParams from '../../x-modules/extra-params/components/renderless-extra-param.vue';
  import SnippetConfigExtraParams from '../../x-modules/extra-params/components/snippet-config-extra-params.vue';
  import NextQueriesList from '../../x-modules/next-queries/components/next-queries-list.vue';
  import NextQueryPreview from '../../x-modules/next-queries/components/next-query-preview.vue';
  import QueryPreviewList from '../../x-modules/queries-preview/components/query-preview-list.vue';
  import Recommendations from '../../x-modules/recommendations/components/recommendations.vue';
  import RelatedTags from '../../x-modules/related-tags/components/related-tags.vue';
  import MainScrollItem from '../../x-modules/scroll/components/main-scroll-item.vue';
  import ScrollToTop from '../../x-modules/scroll/components/scroll-to-top.vue';
  import ClearSearchInput from '../../x-modules/search-box/components/clear-search-input.vue';
  import SearchButton from '../../x-modules/search-box/components/search-button.vue';
  import SearchInput from '../../x-modules/search-box/components/search-input.vue';
  import SearchInputPlaceholder from '../../x-modules/search-box/components/search-input-placeholder.vue';
  import Banner from '../../x-modules/search/components/banner.vue';
  import BannersList from '../../x-modules/search/components/banners-list.vue';
  import PartialQueryButton from '../../x-modules/search/components/partial-query-button.vue';
  import PartialResultsList from '../../x-modules/search/components/partial-results-list.vue';
  import Promoted from '../../x-modules/search/components/promoted.vue';
  import PromotedsList from '../../x-modules/search/components/promoteds-list.vue';
  import Redirection from '../../x-modules/search/components/redirection.vue';
  import ResultsList from '../../x-modules/search/components/results-list.vue';
  import SortPickerList from '../../x-modules/search/components/sort-picker-list.vue';
  import SpellcheckButton from '../../x-modules/search/components/spellcheck-button.vue';
  import Spellcheck from '../../x-modules/search/components/spellcheck.vue';
  import Tagging from '../../x-modules/tagging/components/tagging.vue';
  import UrlHandler from '../../x-modules/url/components/url-handler.vue';
  import MainModal from '../../components/modals/main-modal.vue';
  import OpenMainModal from '../../components/modals/open-main-modal.vue';
  import CloseMainModal from '../../components/modals/close-main-modal.vue';
  import { adapterConfig } from '../adapter';
  import NextQuery from '../../x-modules/next-queries/components/next-query.vue';
  import FallbackDisclaimer from '../../x-modules/search/components/fallback-disclaimer.vue';
  import SemanticQueries from '../../x-modules/semantic-queries/components/semantic-queries.vue';
  import SemanticQuery from '../../x-modules/semantic-queries/components/semantic-query.vue';
  import { useQueriesPreview } from '../../x-modules/queries-preview/composables/use-queries-preview.composable';
  import { QueryPreviewInfo } from '../../x-modules/queries-preview/store/types';
  import QueryPreviewButton from '../../x-modules/queries-preview/components/query-preview-button.vue';
  import DisplayEmitter from '../../components/display-emitter.vue';
  import Aside from './aside.vue';
  import PredictiveLayer from './predictive-layer.vue';
  import Result from './result.vue';
  import { HomeControls } from './types';
  import DisplayResultProvider from './display-result-provider.vue';

  export default defineComponent({
    directives: {
      infiniteScroll
    },
    components: {
      Aside,
      AutoProgressBar,
      Banner,
      BannersList,
      BaseColumnPickerList,
      BaseDropdown,
      BaseGrid,
      BaseIdTogglePanelButton,
      BaseVariableColumnGrid,
      ChevronLeft,
      ChevronRight,
      ChevronUp,
      ClearSearchInput,
      CloseMainModal,
      CrossIcon,
      DisplayEmitter,
      DisplayResultProvider,
      ExperienceControls,
      FallbackDisclaimer,
      Grid2Col,
      Grid4Col,
      LocationProvider,
      MainModal,
      MainScrollItem,
      MultiColumnMaxWidthLayout,
      NextQueriesList,
      NextQuery,
      NextQueryPreview,
      OpenMainModal,
      PartialQueryButton,
      PartialResultsList,
      PredictiveLayer,
      PreselectedFilters,
      Promoted,
      PromotedsList,
      QueryPreviewButton,
      QueryPreviewList,
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
      SearchInputPlaceholder,
      SemanticQueries,
      SemanticQuery,
      SlidingPanel,
      SnippetCallbacks,
      SnippetConfigExtraParams,
      SortPickerList,
      Spellcheck,
      SpellcheckButton,
      Tagging,
      UrlHandler
    },
    setup() {
      const stores = ['Spain', 'Portugal', 'Italy'];
      const initialExtraParams = { store: 'Portugal' };
      const searchInputPlaceholderMessages = [
        'Find shirts',
        'Find shoes',
        'Find watches',
        'Find handbags',
        'Find sunglasses'
      ];
      const columnPickerValues = [0, 2, 4];
      // const resultsAnimation = StaggeredFadeAndSlide;
      const modalAnimation = animateClipPath();
      const selectedColumns = 4;
      const sortValues = ['', 'price asc', 'price desc'];
      const isAnyQueryLoadedInPreview = useQueriesPreview().isAnyQueryLoadedInPreview;

      const controls: ComputedRef<HomeControls> = computed(() => {
        return {
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
          },
          nextQueriesPreview: {
            maxItemsToRender: 10
          },
          nextQueriesList: {
            showOnlyAfterOffset: true
          },
          adapter: {
            useE2EAdapter: false
          }
        };
      });

      provide('controls', controls);

      const queriesPreviewInfo: QueryPreviewInfo[] = [
        {
          query: 'cortina',
          extraParams: { store: 'Gijón' },
          filters: ['categoryIds:66dd06d9f']
        },
        {
          query: 'summer dress',
          filters: ['categoryIds:5b612edb5', 'brand:marni']
        },
        {
          query: 'woven hat'
        },
        {
          query: 'jeans',
          extraParams: { store: 'Gijón' }
        },
        {
          query: 't-shirt'
        }
      ];

      const queries = computed(() => queriesPreviewInfo.map(item => item.query));
      const toggleE2EAdapter = () => {
        adapterConfig.e2e = !adapterConfig.e2e;
      };
      return {
        resultsAnimation: undefined,
        modalAnimation,
        queriesPreviewInfo,
        stores,
        initialExtraParams,
        searchInputPlaceholderMessages,
        columnPickerValues,
        selectedColumns,
        sortValues,
        isAnyQueryLoadedInPreview,
        queries,
        toggleE2EAdapter,
        controls,
        x: use$x()
      };
    }
  });
</script>

<style lang="scss" scoped>
  .x-modal :deep(.x-modal__content) {
    overflow: hidden;
    // Following is needed for closing the modal in base-events-modal.feature
    width: calc(100% - 20px);
    height: calc(100% - 20px);
    margin: 10px;
  }
</style>
