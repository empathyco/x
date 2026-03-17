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
            id="searchInput.instant"
            v-model="controls.searchInput.instant"
            type="checkbox"
            data-test="search-input-instant"
          />
        </label>
      </li>
      <li class="x-test-controls__item">
        <label for="searchInput.instantDebounceInMs">
          search-input - debounce
          <input
            id="searchInput.instantDebounceInMs"
            v-model="controls.searchInput.instantDebounceInMs"
            type="number"
            data-test="search-input-debounce"
          />
        </label>
      </li>
      <li class="x-test-controls__item">
        <label for="popularSearches.maxItemsToRender">
          popular-searches - maxItemsToRender
          <input
            id="popularSearches.maxItemsToRender"
            v-model="controls.popularSearches.maxItemsToRender"
            type="number"
            data-test="popular-searches-max-to-render"
          />
        </label>
      </li>
      <li class="x-test-controls__item">
        <label for="slicedFilters.max">
          sliced-filters - max
          <input
            id="slicedFilters.max"
            v-model="controls.slicedFilters.max"
            type="number"
            data-test="sliced-filters-max"
          />
        </label>
      </li>
      <li class="x-test-controls__item">
        <label for="historyQueries.maxItemsToRender">
          history-queries - maxItemsToRender
          <input
            id="historyQueries.maxItemsToRender"
            v-model="controls.historyQueries.maxItemsToRender"
            type="number"
            data-test="history-queries-max-to-render"
          />
        </label>
      </li>
      <li class="x-test-controls__item">
        <label for="nextQueriesPreview.maxItemsToRender">
          next-queries-preview - maxItemsToRender
          <input
            id="nextQueriesPreview.maxItemsToRender"
            v-model="controls.nextQueriesPreview.maxItemsToRender"
            type="number"
            data-test="nq-preview-max-to-render"
          />
        </label>
      </li>
      <li class="x-test-controls__item">
        <label for="nextQueriesList.showOnlyAfterOffset">
          next-queries-list - showOnlyAfterOffset
          <input
            id="nextQueriesList.showOnlyAfterOffset"
            v-model="controls.nextQueriesList.showOnlyAfterOffset"
            type="checkbox"
            data-test="nq-preview-show-after-offset"
          />
        </label>
      </li>
      <li class="x-test-controls__item">
        <label for="relatedPromptsList.showOnlyAfterOffset">
          related-prompts-list - showOnlyAfterOffset
          <input
            id="relatedPromptsList.showOnlyAfterOffset"
            v-model="controls.relatedPromptsList.showOnlyAfterOffset"
            type="checkbox"
            data-test="rp-preview-show-after-offset"
          />
        </label>
      </li>
    </ul>
    <hr class="x-mt-10" />
    <h1 class="x-text-primary-50 x-text-4xl x-font-bold x-leading-[1.5]">Teleport test</h1>
    <div id="teleport-here"></div>
    <MainModal :animation="modalAnimation" :reference-selector="referenceSelector">
      <MultiColumnMaxWidthLayout class="x-bg-neutral-0">
        <template #header-middle>
          <div
            class="x-flex x-flex-col x-gap-16 x-items-stretch x-flex-auto"
            :data-test="`main-scroll-${mainScrollDirection}`"
          >
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
                <ChevronLeftIcon />
              </template>
              <RelatedTags
                :animation="resultsAnimation"
                class="x-gap-8"
                item-class="x-tag-outlined"
              />
              <template #sliding-panel-right-button>
                <ChevronRightIcon />
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
            panel-id="aside-panel"
          >
            Toggle Aside
          </BaseIdTogglePanelButton>
        </template>

        <template #toolbar-body>
          <div v-if="x.totalResults > 0" class="x-flex x-items-center x-gap-12">
            <span class="x-text1">{{ x.totalResults }} Results</span>
            <BaseColumnPickerList
              :model-value="selectedColumns"
              class="x-gap-4"
              :columns="columnPickerValues"
              @update:model-value="(col: any) => (selectedColumns = col)"
            >
              <template #default="{ column }">
                <span v-if="column === 0">Auto</span>
                <Grid2ColIcon v-else-if="column === 2" />
                <Grid4ColIcon v-else-if="column === 4" />
              </template>

              <template #divider>
                <span class="x-button-group-divider"></span>
              </template>
            </BaseColumnPickerList>
            <SortPickerList
              v-slot="{ item }"
              :items="sortValues"
              class="x-button-group"
              button-class="x-button x-button-outlined"
            >
              {{ item || 'default' }}
            </SortPickerList>

            <RenderlessExtraParams v-slot="{ value, updateValue }" name="store">
              <BaseDropdown
                :model-value="value"
                :items="stores"
                class="x-dropdown x-dropdown--round x-dropdown--right x-dropdown--l"
                data-test="store-selector"
                @update:model-value="updateValue"
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
            v-slot="{ redirection, redirect, abortRedirect, isRedirecting, delayInSeconds }"
            class="x-p-28 x-flex x-flex-col x-gap-8 x-items-center x-bg-lead-25 x-my-8"
            :delay-in-seconds="5"
          >
            <p>Your search matches a special place in our website. You are being redirected to:</p>
            <a :href="redirection.url" data-test="redirection-link" @click="redirect">
              {{ redirection.url }}
            </a>
            <div class="x-flex x-gap-32">
              <button class="x-button--ghost x-button x-text-neutral-25" @click="abortRedirect">
                No, I'll stay here
              </button>
              <button class="x-button--ghost x-button x-text-neutral-90" @click="redirect">
                Yes, redirect me
              </button>
            </div>
            <AutoProgressBar :is-loading="isRedirecting" :duration-in-seconds="delayInSeconds" />
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
            <LocationProvider location="results">
              <AiCarousel v-if="x.noResults && !x.fromNoResultsWithFilters" class="x-mb-28">
                <template #result="{ result }">
                  <Result :result="result" class="x-w-[150px]" />
                </template>
                <template #extra-content>
                  <button class="x-bg-lead-50 x-absolute x-bottom-0 x-right-0 x-translate-y-full">
                    extra content
                  </button>
                </template>
                <template #cta-button>
                  <button class="x-bg-lead-50 x-absolute x-right-1/2 x-bottom-0 x-translate-y-1/2">
                    AI Mode
                  </button>
                </template>
              </AiCarousel>
              <AiOverview v-else class="x-mb-28">
                <template #result="{ result }">
                  <Result :result="result" class="x-w-[150px]" />
                </template>
                <template #extra-content>
                  <button class="x-bg-lead-50 x-absolute x-bottom-0 x-right-0 x-translate-y-full">
                    extra content
                  </button>
                </template>
              </AiOverview>
            </LocationProvider>
            <template v-if="!x.query.searchBox">
              <!-- Brand Recommendations -->
              <h1 class="x-mb-16 x-title1">Brand Recommendations</h1>
              <LocationProvider location="no_results">
                <QueryPreviewList
                  v-slot="{ queryPreviewInfo, totalResults, results, displayTagging, queryTagging }"
                  :debounce-time-ms="250"
                  :queries-preview-info="queriesPreviewInfo"
                  data-wysiwyg="query-preview-list"
                  data-test="brand-recommendations-list"
                  :persist-in-cache="true"
                >
                  <DisplayEmitter
                    :payload="displayTagging"
                    :event-metadata="{ feature: 'customer', replaceable: false }"
                  >
                    <div class="x-flex x-flex-col x-gap-8 x-mb-16">
                      <QueryPreviewButton
                        class="x-w-fit x-button-xl x-button-ghost"
                        :query-preview-info="queryPreviewInfo"
                        :metadata="{ feature: 'customer' }"
                      >
                        {{ `${queryPreviewInfo.query} (${totalResults})` }}
                      </QueryPreviewButton>
                      <DisplayResultProvider :query-tagging="queryTagging">
                        <SlidingPanel :reset-on-content-change="false">
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
                      <RelatedPromptsList
                        :show-only-after-offset="controls.relatedPromptsList.showOnlyAfterOffset"
                        class="x-mot-related-prompt-list"
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
                              v-slot="{ results }"
                              :suggestion="nextQueries[0]"
                              :max-items-to-render="controls.nextQueriesPreview.maxItemsToRender"
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
                                <SlidingPanel :reset-on-content-change="false">
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

                          <template #related-prompts-group>
                            <RelatedPromptsTagList
                              button-class="x-button-lead x-button-circle x-button-ghost x-p-0"
                              class="-x-mb-1 x-mt-24 desktop:x-mt-0 x-p-0 x-h-[70px]"
                              tag-class="x-rounded-xl x-gap-8 x-w-[300px] x-max-w-[400px]"
                              :tag-colors="['x-bg-amber-300', 'x-bg-amber-400', 'x-bg-amber-500']"
                              scroll-container-class="desktop:x-sliding-panel-fade desktop:x-sliding-panel-fade-sm"
                            >
                              <template #default="{ relatedPrompt, isSelected, onSelect }">
                                <DisplayEmitter
                                  :payload="relatedPrompt.toolingDisplayTagging"
                                  :event-metadata="{
                                    feature: 'related-prompts',
                                    displayOriginalQuery: x.query.searchBox,
                                    replaceable: false,
                                  }"
                                >
                                  <RelatedPrompt
                                    :related-prompt="relatedPrompt"
                                    :selected="isSelected"
                                    data-wysiwyg="related-prompt"
                                    :data-wysiwyg-id="relatedPrompt.suggestionText"
                                    @click="onSelect"
                                  />
                                </DisplayEmitter>
                              </template>
                            </RelatedPromptsTagList>
                            <LocationProvider location="related_prompts">
                              <QueryPreviewList
                                v-if="selectedPrompt !== -1"
                                v-slot="{ queryPreviewInfo, totalResults, results }"
                                :queries-preview-info="relatedPromptsQueriesPreviewInfo"
                                query-feature="related_prompts"
                              >
                                <div class="x-flex x-flex-col x-gap-8 x-mb-16">
                                  <QueryPreviewButton
                                    :query-preview-info="queryPreviewInfo"
                                    class="x-button x-button-lead x-button-tight x-title3 x-title3-sm desktop:x-title3-md max-desktop:x-px-16"
                                  >
                                    {{ queryPreviewInfo.query }}
                                    ({{ totalResults }})
                                    <ArrowRightIcon class="x-icon-lg" />
                                  </QueryPreviewButton>
                                  <DisplayEmitter
                                    :payload="getToolingDisplayTagging(queryPreviewInfo)"
                                    :event-metadata="{
                                      feature: 'related-prompts',
                                      displayOriginalQuery: x.query.searchBox,
                                    }"
                                  >
                                    <SlidingPanel :reset-on-content-change="false">
                                      <DisplayClickProvider
                                        result-feature="related_prompts"
                                        :tooling-display-tagging="
                                          getToolingDisplayClickTagging(queryPreviewInfo)
                                        "
                                        :tooling-add2-cart-tagging="
                                          getToolingAdd2CartTagging(queryPreviewInfo)
                                        "
                                      >
                                        <div class="x-flex x-gap-8">
                                          <Result
                                            v-for="result in results"
                                            :key="result.id"
                                            :result="result"
                                            style="max-width: 180px"
                                            data-test="semantic-query-result"
                                          />
                                        </div>
                                      </DisplayClickProvider>
                                    </SlidingPanel>
                                  </DisplayEmitter>
                                </div>
                              </QueryPreviewList>
                            </LocationProvider>
                          </template>
                        </BaseVariableColumnGrid>
                      </RelatedPromptsList>
                    </NextQueriesList>
                  </BannersList>
                </PromotedsList>
              </ResultsList>
            </LocationProvider>

            <!-- Semantic Queries -->
            <SemanticQueries v-slot="{ queries: semanticQueries, findSemanticQuery }">
              <section class="x-mt-28">
                <h1 v-if="isAnyQueryLoadedInPreview(semanticQueries)" class="x-title1">
                  Similar Semantic Queries
                </h1>
                <LocationProvider :location="x.noResults ? 'no_results' : 'low_results'">
                  <QueryPreviewList
                    v-slot="{ queryPreviewInfo: { query }, results, queryTagging }"
                    :queries-preview-info="semanticQueries.map((q: any) => ({ query: q }))"
                    query-feature="semantics"
                  >
                    <div
                      class="x-flex x-flex-col x-gap-8 x-mb-16"
                      data-test="semantic-query-preview"
                      :data-query="query"
                    >
                      <!-- eslint-disable vue/no-template-shadow -->
                      <SemanticQuery
                        v-slot="{ suggestion: { query } }"
                        class="x-suggestion x-title2 x-title2-md"
                        :suggestion="findSemanticQuery(query)"
                      >
                        <span data-test="semantic-queries-query">{{ query }}</span>
                      </SemanticQuery>
                      <!-- eslint-enable vue/no-template-shadow -->
                      <DisplayResultProvider :query-tagging="queryTagging">
                        <SlidingPanel :reset-on-content-change="false">
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
                <BaseGrid :animation="resultsAnimation" :columns="4" :items="partialResult.results">
                  <template #result="{ item }">
                    <Result :result="item" data-test="partial-result-item" />
                  </template>
                </BaseGrid>
                <PartialQueryButton :query="partialResult.query">
                  <template #default="{ query }">Ver todos {{ query }}</template>
                </PartialQueryButton>
              </template>
            </PartialResultsList>

            <!-- Recommendations -->
            <Recommendations v-if="!x.query.search || x.noResults">
              <template #layout="{ recommendations }">
                <BaseVariableColumnGrid
                  v-slot="{ item: result }"
                  :animation="resultsAnimation"
                  :items="recommendations"
                >
                  <Result :result="result" data-test="recommendation-item" />
                </BaseVariableColumnGrid>
              </template>
            </Recommendations>
          </template>
        </template>

        <template #scroll-to-top>
          <ScrollToTop :threshold-px="500" class="x-button--round" scroll-id="main-scroll">
            <ChevronUpIcon />
          </ScrollToTop>
        </template>
      </MultiColumnMaxWidthLayout>
    </MainModal>
  </div>
  <BaseTeleport target="#teleport-here">This is the teleport content</BaseTeleport>
</template>

<script lang="ts">
import type { TaggingRequest } from '@empathyco/x-types'
import type { QueryPreviewInfo } from '@x/x-modules/queries-preview'
import type { ComputedRef } from 'vue'
import type { HomeControls } from './types'
import {
  animateClipPath,
  ArrowRightIcon,
  AutoProgressBar,
  BaseColumnPickerList,
  BaseDropdown,
  BaseGrid,
  BaseIdTogglePanelButton,
  BaseTeleport,
  BaseVariableColumnGrid,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  CloseMainModal,
  CrossIcon,
  DisplayClickProvider,
  DisplayEmitter,
  Grid2ColIcon,
  Grid4ColIcon,
  LocationProvider,
  MainModal,
  MultiColumnMaxWidthLayout,
  OpenMainModal,
  SearchIcon,
  SlidingPanel,
  SnippetCallbacks,
  StaggeredFadeAndSlide,
} from '@x/components'
import { use$x, useState } from '@x/composables'
import { infiniteScroll } from '@x/directives'
import { AiCarousel, AiOverview } from '@x/x-modules/ai'
import { ExperienceControls } from '@x/x-modules/experience-controls'
import { RenderlessExtraParams, SnippetConfigExtraParams } from '@x/x-modules/extra-params'
import { PreselectedFilters } from '@x/x-modules/facets'
import { NextQueriesList, NextQuery, NextQueryPreview } from '@x/x-modules/next-queries'
import {
  QueryPreviewButton,
  QueryPreviewList,
  useQueriesPreview,
} from '@x/x-modules/queries-preview'
import { Recommendations } from '@x/x-modules/recommendations'
import {
  RelatedPrompt,
  RelatedPromptsList,
  RelatedPromptsTagList,
} from '@x/x-modules/related-prompts'
import { RelatedTags } from '@x/x-modules/related-tags'
import { MainScrollItem, ScrollToTop } from '@x/x-modules/scroll'
import {
  Banner,
  BannersList,
  FallbackDisclaimer,
  PartialQueryButton,
  PartialResultsList,
  Promoted,
  PromotedsList,
  Redirection,
  ResultsList,
  SortPickerList,
  Spellcheck,
  SpellcheckButton,
} from '@x/x-modules/search'
import {
  ClearSearchInput,
  SearchButton,
  SearchInput,
  SearchInputPlaceholder,
} from '@x/x-modules/search-box'
import { SemanticQueries, SemanticQuery } from '@x/x-modules/semantic-queries'
import { Tagging } from '@x/x-modules/tagging'
import { UrlHandler } from '@x/x-modules/url'
import { computed, defineComponent, provide, ref } from 'vue'
import Aside from './aside.vue'
import DisplayResultProvider from './display-result-provider.vue'
import PredictiveLayer from './predictive-layer.vue'
import Result from './result.vue'

export default defineComponent({
  directives: {
    infiniteScroll,
  },
  components: {
    AiCarousel,
    AiOverview,
    ArrowRightIcon,
    // eslint-disable-next-line vue/no-reserved-component-names
    Aside,
    AutoProgressBar,
    Banner,
    BannersList,
    BaseColumnPickerList,
    BaseDropdown,
    BaseGrid,
    BaseIdTogglePanelButton,
    BaseTeleport,
    BaseVariableColumnGrid,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronUpIcon,
    ClearSearchInput,
    CloseMainModal,
    CrossIcon,
    DisplayClickProvider,
    DisplayEmitter,
    DisplayResultProvider,
    ExperienceControls,
    FallbackDisclaimer,
    Grid2ColIcon,
    Grid4ColIcon,
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
    RelatedPrompt,
    RelatedPromptsList,
    RelatedPromptsTagList,
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
    UrlHandler,
  },
  setup() {
    const x = use$x()
    const stores = ['Spain', 'Portugal', 'Italy']
    const initialExtraParams = { store: 'Portugal' }
    const searchInputPlaceholderMessages = [
      'Find shirts',
      'Find shoes',
      'Find watches',
      'Find handbags',
      'Find sunglasses',
    ]
    const columnPickerValues = [0, 2, 4]
    const resultsAnimation = StaggeredFadeAndSlide
    const modalAnimation = animateClipPath()
    const selectedColumns = 4
    const sortValues = ['', 'price asc', 'price desc']
    const isAnyQueryLoadedInPreview = useQueriesPreview().isAnyQueryLoadedInPreview
    const referenceSelector = ref()

    const scrollData = useState('scroll').data
    const mainScrollDirection = computed(() => scrollData.value['main-scroll']?.direction)

    const controls: ComputedRef<HomeControls> = computed(() => {
      return {
        searchInput: {
          instant: true,
          instantDebounceInMs: 500, // default
        },
        popularSearches: {
          maxItemsToRender: 10,
        },
        slicedFilters: {
          max: 4,
        },
        historyQueries: {
          maxItemsToRender: 5,
        },
        nextQueriesPreview: {
          maxItemsToRender: 10,
        },
        nextQueriesList: {
          showOnlyAfterOffset: true,
        },
        relatedPromptsList: {
          showOnlyAfterOffset: true,
        },
        adapter: {
          useE2EAdapter: false,
        },
      }
    })

    provide('controls', controls)

    const { relatedPrompts, selectedPrompt } = useState('relatedPrompts')

    const relatedPromptsQueriesPreviewInfo = computed(() => {
      const queries = relatedPrompts.value?.[selectedPrompt.value].relatedPromptNextQueries ?? []
      return queries.map(({ query }) => ({ query }))
    })

    const fallbackTaggingRequest = {} as TaggingRequest
    const findNextQuery = (queryPreviewInfo: QueryPreviewInfo) =>
      relatedPrompts.value[selectedPrompt.value].relatedPromptNextQueries?.find(
        nextQuery => nextQuery.query === queryPreviewInfo.query,
      )

    const getToolingDisplayTagging = (queryPreviewInfo: QueryPreviewInfo) =>
      findNextQuery(queryPreviewInfo)?.toolingDisplayTagging ?? fallbackTaggingRequest
    const getToolingAdd2CartTagging = (queryPreviewInfo: QueryPreviewInfo) =>
      findNextQuery(queryPreviewInfo)?.toolingDisplayAdd2CartTagging ?? fallbackTaggingRequest
    const getToolingDisplayClickTagging = (queryPreviewInfo: QueryPreviewInfo) =>
      findNextQuery(queryPreviewInfo)?.toolingDisplayClickTagging ?? fallbackTaggingRequest

    const queriesPreviewInfo: QueryPreviewInfo[] = [
      {
        query: 'cortina',
        extraParams: { store: 'Gijón' },
        filters: ['categoryIds:66dd06d9f'],
      },
      {
        query: 'summer dress',
        filters: ['categoryIds:5b612edb5', 'brand:marni'],
      },
      {
        query: 'woven hat',
      },
      {
        query: 'jeans',
        extraParams: { store: 'Gijón' },
      },
      {
        query: 't-shirt',
      },
    ]

    const queries = computed(() => queriesPreviewInfo.map(item => item.query))
    return {
      resultsAnimation,
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
      controls,
      x,
      mainScrollDirection,
      relatedPromptsQueriesPreviewInfo,
      selectedPrompt,
      referenceSelector,
      getToolingDisplayTagging,
      getToolingDisplayClickTagging,
      getToolingAdd2CartTagging,
    }
  },
})
</script>

<style lang="css">
.x-modal .x-modal__content {
  overflow: hidden;
  /* Following is needed for closing the modal in base-events-modal.feature */
  width: calc(100% - 20px);
  height: calc(100% - 20px);
  margin: 10px;
}
</style>
