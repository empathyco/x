<template>
  <MainModal :animation="modalAnimation">
    <div class="xds:h-full xds:bg-neutral-0 xds:layout">
      <div class="xds:layout-container xds:layout-max-width-md xds:layout-min-margin-48">
        <!-- HEADER -->
        <header class="xds:layout-item xds:border-b-1 xds:border-b-neutral-25 xds:pt-32 xds:pb-16">
          <div class="xds:flex xds:flex-row">
            <!-- HEADER START -->
            <div class="xds:flex xds:w-full xds:min-w-0 xds:flex-col xds:gap-16 xds:pl-256">
              <!-- SEARCH-BOX INPUT GROUP -->
              <div class="xds:input-group xds:w-full xds:rounded-sm xds:input-group-lead">
                <div class="xds:relative xds:flex xds:input">
                  <SearchInputPlaceholder :messages="searchInputPlaceholderMessages" />
                  <SearchInput
                    aria-label="Search for products"
                    :instant="controls.searchInput.instant"
                    :instant-debounce-in-ms="controls.searchInput.instantDebounceInMs"
                  />
                </div>
                <ClearSearchInput
                  class="xds:input-group-button xds:input-group-button-rectangle xds:input-group-button-ghost"
                  aria-label="Clear query"
                >
                  Clear
                </ClearSearchInput>
                <SearchButton aria-label="Search" class="xds:input-group-button-primary">
                  <SearchIcon />
                </SearchButton>
              </div>
              <!-- SPELLCHECK -->
              <Spellcheck>
                <template #default="{ query }">
                  No results found for '{{ query }}'. We show you results for
                  <SpellcheckButton class="xds:button xds:button-link" />
                </template>
              </Spellcheck>
              <!-- RELATED-TAGS -->
              <SlidingPanel v-if="x.relatedTags.length">
                <RelatedTags
                  :animation="staggeredFadeAndSlideAnimation"
                  class="xds:gap-8"
                  item-class="xds:tag-outlined"
                />
              </SlidingPanel>
              <!-- PREDICTIVE -->
              <PredictiveLayer :controls="controls" />
            </div>

            <!-- HEADER END -->
            <div class="xds:ml-16">
              <CloseMainModal class="xds:button xds:button-circle">
                <CrossIcon />
              </CloseMainModal>
            </div>
          </div>
        </header>

        <!-- TOOLBAR -->
        <div v-if="x.totalResults > 0" class="xds:layout-item xds:layout-no-margin-right">
          <div class="xds:mt-12 xds:flex xds:gap-6">
            <!-- TOOLBAR ASIDE -->
            <BaseIdTogglePanelButton
              class="xds:button xds:w-1/5 xds:button-lead"
              panel-id="aside-panel"
            >
              Toggle Aside
            </BaseIdTogglePanelButton>

            <!-- TOOLBAR MAIN -->
            <div class="xds:flex xds:items-center xds:gap-12">
              <span class="xds:text1">{{ x.totalResults }} Results</span>
              <BaseColumnPickerList
                :model-value="selectedColumns"
                class="xds:gap-4"
                :columns="columnPickerValues"
                @update:model-value="col => (selectedColumns = col)"
              >
                <template #default="{ column }">
                  <span v-if="column === 0">Auto</span>
                  <Grid2ColIcon v-else-if="column === 2" />
                  <Grid4ColIcon v-else-if="column === 4" />
                </template>
                <template #divider>
                  <span class="xds:button-group-divider" />
                </template>
              </BaseColumnPickerList>
              <SortPickerList
                v-slot="{ item }"
                :items="sortValues"
                class="xds:button-group"
                button-class="xds:button xds:button-outlined"
              >
                {{ item || 'default' }}
              </SortPickerList>
              <RenderlessExtraParams v-slot="{ value, updateValue }" name="store">
                <BaseDropdown
                  :model-value="value"
                  :items="stores"
                  @update:model-value="updateValue"
                />
              </RenderlessExtraParams>
            </div>
          </div>
        </div>

        <!-- BODY -->
        <div class="xds:layout-item xds:layout-expand xds:layout-no-margin-right">
          <div class="xds:flex xds:layout-expand xds:pt-12">
            <!-- ASIDE -->
            <BaseIdTogglePanel
              v-show="x.totalResults > 0"
              panel-id="aside-panel"
              :animation="asideAnimation"
              class="xds:w-1/5"
            >
              <Scroll id="aside-scroll" class="xds:h-full">
                <FacetsAside :controls="controls" />
              </Scroll>
            </BaseIdTogglePanel>

            <!-- MAIN -->
            <MainScroll class="xds:flex xds:w-full xds:flex-1">
              <Scroll id="main-scroll" class="xds:flex xds:flex-col">
                <!-- REDIRECTION -->
                <Redirection
                  v-slot="{ redirection, redirect, abortRedirect, isRedirecting, delayInSeconds }"
                  class="xds:my-8 xds:flex xds:flex-col xds:items-center xds:gap-8 xds:bg-lead-25 xds:p-28"
                  :delay-in-seconds="5"
                >
                  <p>
                    Your search matches a special place in our website. You are being redirected to:
                  </p>
                  <a :href="redirection.url" @click="redirect">
                    {{ redirection.url }}
                  </a>
                  <div class="xds:flex xds:gap-32">
                    <button
                      class="xds:button xds:button-ghost xds:text-neutral-25"
                      @click="abortRedirect"
                    >
                      No, I'll stay here
                    </button>
                    <button
                      class="xds:button xds:button-ghost xds:text-neutral-90"
                      @click="redirect"
                    >
                      Yes, redirect me
                    </button>
                  </div>
                  <AutoProgressBar
                    :is-loading="isRedirecting"
                    :duration-in-seconds="delayInSeconds"
                  />
                </Redirection>

                <template v-if="!x.redirections.length">
                  <!-- FALLBACK DISCLAIMER -->
                  <FallbackDisclaimer class="x-message" />

                  <!-- NO-RESULTS MESSAGE -->
                  <div
                    v-if="x.noResults && !x.fromNoResultsWithFilters"
                    class="xds:my-8 xds:flex xds:flex-col xds:items-center xds:gap-8 xds:bg-lead-25 xds:p-28"
                  >
                    <p>
                      There are no results for
                      <span class="xds:font-bold">{{ x.query.search }}</span>
                    </p>
                    <p>You may be interested in these:</p>
                  </div>

                  <!-- AI -->
                  <LocationProvider location="results">
                    <AiCarousel
                      v-if="x.noResults && !x.fromNoResultsWithFilters"
                      class="xds:mb-28 xds:w-full"
                    >
                      <template #result="{ result }">
                        <Result :result="result" class="xds:w-37.5" />
                      </template>
                      <template #extra-content>
                        <button
                          class="xds:absolute xds:right-0 xds:bottom-0 xds:translate-y-full xds:bg-lead-50"
                        >
                          extra content
                        </button>
                      </template>
                      <template #cta-button>
                        <button
                          class="xds:absolute xds:right-1/2 xds:bottom-0 xds:translate-y-1/2 xds:bg-lead-50"
                        >
                          AI Mode
                        </button>
                      </template>
                    </AiCarousel>
                    <AiOverview v-else class="xds:mb-28 xds:w-full">
                      <template #result="{ result }">
                        <Result :result="result" class="xds:w-37.5" />
                      </template>
                      <template #extra-content>
                        <button
                          class="xds:absolute xds:right-0 xds:bottom-0 xds:translate-y-full xds:bg-lead-50"
                        >
                          extra content
                        </button>
                      </template>
                    </AiOverview>
                  </LocationProvider>

                  <template v-if="!x.query.searchBox">
                    <!-- BRAND RECOMMENDATIONS -->
                    <h1 class="xds:mb-16 xds:title1">Brand Recommendations</h1>
                    <LocationProvider location="no_results">
                      <QueryPreviewList
                        v-slot="{
                          queryPreviewInfo,
                          totalResults,
                          results,
                          displayTagging,
                          queryTagging,
                        }"
                        :debounce-time-ms="250"
                        :queries-preview-info="queriesPreviewInfo"
                        data-wysiwyg="query-preview-list"
                        :persist-in-cache="true"
                      >
                        <DisplayEmitter
                          :payload="displayTagging"
                          :event-metadata="{ feature: 'customer', replaceable: false }"
                        >
                          <div class="xds:mb-16 xds:flex xds:flex-col xds:gap-8">
                            <QueryPreviewButton
                              class="xds:button-xl xds:w-fit xds:button-ghost"
                              :query-preview-info="queryPreviewInfo"
                              :metadata="{ feature: 'customer' }"
                            >
                              {{ `${queryPreviewInfo.query} (${totalResults})` }}
                            </QueryPreviewButton>
                            <DisplayResultProvider :query-tagging="queryTagging">
                              <SlidingPanel :reset-on-content-change="false">
                                <div class="xds:flex xds:gap-8">
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

                  <!-- GRID -->
                  <LocationProvider location="results">
                    <ResultsList
                      v-infinite-scroll:main-scroll="{ margin: 600 }"
                      data-wysiwyg="results"
                    >
                      <PromotedsList>
                        <BannersList>
                          <NextQueriesList
                            :show-only-after-offset="controls.nextQueriesList.showOnlyAfterOffset"
                          >
                            <RelatedPromptsList
                              :show-only-after-offset="
                                controls.relatedPromptsList.showOnlyAfterOffset
                              "
                            >
                              <BaseVariableColumnGrid
                                style="--x-size-min-width-grid-item: 150px"
                                class="xds:gap-12"
                                :animation="staggeredFadeAndSlideAnimation"
                                :columns="x.device === 'mobile' ? 2 : 4"
                              >
                                <template #result="{ item: result }">
                                  <MainScrollItem :item="result">
                                    <Result :result="result" />
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
                                    :max-items-to-render="
                                      controls.nextQueriesPreview.maxItemsToRender
                                    "
                                    class="xds:pt-24"
                                  >
                                    <h1 class="xds:title2">Others clients have searched</h1>
                                    <NextQuery
                                      class="xds:suggestion xds:text1 xds:text1-lg"
                                      :suggestion="nextQueries[0]"
                                    >
                                      <span class="xds:font-bold">
                                        {{ nextQueries[0].query }}
                                      </span>
                                    </NextQuery>
                                    <div class="xds:mb-24">
                                      <SlidingPanel :reset-on-content-change="false">
                                        <div class="xds:flex xds:flex-row xds:gap-8">
                                          <Result
                                            v-for="result in results"
                                            :key="result.id"
                                            :result="result"
                                            style="max-width: 180px"
                                          />
                                        </div>
                                      </SlidingPanel>
                                    </div>
                                    <NextQuery
                                      :suggestion="nextQueries[0]"
                                      class="xds:mx-auto xds:mt-8 xds:mb-24 xds:button xds:button-outlined xds:rounded-full"
                                    >
                                      {{ 'View all results' }}
                                    </NextQuery>
                                  </NextQueryPreview>
                                </template>

                                <template #related-prompts-group>
                                  <RelatedPromptsTagList
                                    button-class="xds:button-lead xds:button-circle xds:button-ghost xds:p-0"
                                    class="desktop:xds:mt-0 xds:mt-24 xds:mb-1 xds:h-17.5 xds:p-0"
                                    tag-class="xds:rounded-xl xds:gap-8 xds:w-[300px] xds:max-w-[400px]"
                                    :tag-colors="[
                                      'xds:bg-amber-300',
                                      'xds:bg-amber-400',
                                      'xds:bg-amber-500',
                                    ]"
                                    scroll-container-class="desktop:xds:sliding-panel-fade desktop:xds:sliding-panel-fade-sm"
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
                                      <div class="xds:mb-16 xds:flex xds:flex-col xds:gap-8">
                                        <QueryPreviewButton
                                          :query-preview-info="queryPreviewInfo"
                                          class="desktop:xds:title3-md max-desktop:xds:px-16 xds:button xds:button-tight xds:button-lead xds:title3 xds:title3-sm"
                                        >
                                          {{ queryPreviewInfo.query }}
                                          ({{ totalResults }})
                                          <ArrowRightIcon class="xds:icon-lg" />
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
                                              <div class="xds:flex xds:gap-8">
                                                <Result
                                                  v-for="result in results"
                                                  :key="result.id"
                                                  :result="result"
                                                  style="max-width: 180px"
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

                  <!-- SEMANTIC QUERIES -->
                  <SemanticQueries v-slot="{ queries: semanticQueries, findSemanticQuery }">
                    <section class="xds:mt-28">
                      <h1 v-if="isAnyQueryLoadedInPreview(semanticQueries)" class="xds:title1">
                        Similar Semantic Queries
                      </h1>
                      <LocationProvider :location="x.noResults ? 'no_results' : 'low_results'">
                        <QueryPreviewList
                          v-slot="{ queryPreviewInfo: { query }, results, queryTagging }"
                          :queries-preview-info="semanticQueries.map((q: string) => ({ query: q }))"
                          query-feature="semantics"
                        >
                          <div
                            class="xds:mb-16 xds:flex xds:flex-col xds:gap-8"
                            :data-query="query"
                          >
                            <SemanticQuery
                              class="xds:suggestion xds:title2 xds:title2-md"
                              :suggestion="findSemanticQuery(query)"
                            >
                              {{ query }}
                            </SemanticQuery>

                            <DisplayResultProvider :query-tagging="queryTagging">
                              <SlidingPanel :reset-on-content-change="false">
                                <div class="xds:flex xds:gap-8">
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
                        </QueryPreviewList>
                      </LocationProvider>
                    </section>
                  </SemanticQueries>

                  <!-- PARTIALS -->
                  <PartialResultsList
                    v-if="!x.fromNoResultsWithFilters && (x.totalResults <= 4 || x.noResults)"
                    :animation="staggeredFadeAndSlideAnimation"
                  >
                    <template #default="{ partialResult }">
                      <span>{{ partialResult.query }}</span>
                      <BaseGrid
                        :animation="staggeredFadeAndSlideAnimation"
                        :columns="4"
                        :items="partialResult.results"
                      >
                        <template #result="{ item }">
                          <Result :result="item" />
                        </template>
                      </BaseGrid>
                      <PartialQueryButton :query="partialResult.query">
                        <template #default="{ query }">Ver todos {{ query }}</template>
                      </PartialQueryButton>
                    </template>
                  </PartialResultsList>

                  <!-- RECOMMENDATIONS -->
                  <Recommendations v-if="!x.query.search || x.noResults">
                    <template #default="{ recommendations }">
                      <BaseVariableColumnGrid
                        v-slot="{ item: result }"
                        :animation="staggeredFadeAndSlideAnimation"
                        :items="recommendations"
                      >
                        <Result :result="result" />
                      </BaseVariableColumnGrid>
                    </template>
                  </Recommendations>
                </template>
              </Scroll>
            </MainScroll>
          </div>
        </div>

        <div class="xds:layout-overlap xds:layout-item">
          <ScrollToTop
            :threshold-px="500"
            class="xds:layout-on-margin-right xds:mb-4 xds:button xds:button-circle xds:button-md xds:justify-self-start"
            scroll-id="main-scroll"
          >
            <ChevronUpIcon />
          </ScrollToTop>
        </div>
      </div>
    </div>
  </MainModal>
</template>

<script setup lang="ts">
import type { TaggingRequest } from '@empathyco/x-types'
import type { QueryPreviewInfo } from '@x/x-modules/queries-preview'
import type { PropType } from 'vue'
import type { HomeControls } from './types'
import {
  AnimateClipPath,
  AnimateWidth,
  ArrowRightIcon,
  AutoProgressBar,
  BaseColumnPickerList,
  BaseDropdown,
  BaseGrid,
  BaseIdTogglePanel,
  BaseIdTogglePanelButton,
  BaseVariableColumnGrid,
  ChevronUpIcon,
  CloseMainModal,
  CrossIcon,
  DisplayClickProvider,
  DisplayEmitter,
  Grid2ColIcon,
  Grid4ColIcon,
  LocationProvider,
  MainModal,
  SearchIcon,
  SlidingPanel,
  StaggeredFadeAndSlide,
} from '@x/components'
import { use$x, useState } from '@x/composables'
import { infiniteScroll } from '@x/directives'
import { AiCarousel, AiOverview } from '@x/x-modules/ai'
import { RenderlessExtraParams } from '@x/x-modules/extra-params'
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
import { computed, ref } from 'vue'
import MainScroll from '../../../src/x-modules/scroll/components/main-scroll.vue'
import Scroll from '../../../src/x-modules/scroll/components/scroll.vue'
import DisplayResultProvider from './display-result-provider.vue'
import FacetsAside from './facets-aside.vue'
import PredictiveLayer from './predictive-layer.vue'
import Result from './result.vue'

defineProps({
  controls: {
    type: Object as PropType<HomeControls>,
    required: true,
  },
})

const modalAnimation = AnimateClipPath
const asideAnimation = AnimateWidth
const staggeredFadeAndSlideAnimation = StaggeredFadeAndSlide
const vInfiniteScroll = infiniteScroll

const x = use$x()
const { relatedPrompts, selectedPrompt } = useState('relatedPrompts')
const isAnyQueryLoadedInPreview = useQueriesPreview().isAnyQueryLoadedInPreview

const searchInputPlaceholderMessages = ['Find shirts', 'Find shoes', 'Find watches', 'Find handbag']
const columnPickerValues = [0, 2, 4]
const selectedColumns = ref(4)
const sortValues = ['', 'price asc', 'price desc']
const stores = ['Spain', 'Portugal', 'Italy']
const queriesPreviewInfo: QueryPreviewInfo[] = [
  { query: 'cortina', extraParams: { store: 'Gijón' }, filters: ['categoryIds:66dd06d9f'] },
  { query: 'summer dress', filters: ['categoryIds:5b612edb5', 'brand:marni'] },
  { query: 'woven hat' },
  { query: 'jeans', extraParams: { store: 'Gijón' } },
  { query: 't-shirt' },
]

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
