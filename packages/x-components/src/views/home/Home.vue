<template>
  <div class="x text-neutral-90">
    <Tagging :consent="false" />
    <SnippetConfigExtraParams :values="initialExtraParams" />
    <PreselectedFilters />
    <UrlHandler query="q" store="store" />
    <SnippetCallbacks />
    <ExperienceControls />
    <OpenMainModal>Start</OpenMainModal>
    <h1 class="text-primary-50 text-4xl font-bold leading-[1.5]">Test controls</h1>
    <ul class="x-test-controls flex flex-col gap-16">
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
      <li class="x-test-controls__item">
        <label for="adapter.e2eAdapter">
          Use mocked adapter
          <input
            id="adapter.e2eAdapter"
            v-model="controls.adapter.useE2EAdapter"
            type="checkbox"
            data-test="adapter-e2e"
            @change="toggleE2EAdapter"
          />
        </label>
      </li>
    </ul>
    <hr class="mt-10" />
    <h1 class="text-primary-50 text-4xl font-bold leading-[1.5]">Teleport test</h1>
    <div id="teleport-here"></div>
    <MainModal :animation="modalAnimation" :reference-selector="referenceSelector">
      <MultiColumnMaxWidthLayout class="bg-neutral-0">
        <template #header-middle>
          <div
            class="flex flex-col gap-16 items-stretch flex-auto"
            :data-test="`main-scroll-${mainScrollDirection}`"
          >
            <div class="x-input-group x-input-group-lead rounded-sm">
              <div class="x-input x-search-input-placeholder-container flex">
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
              <RelatedTags
                :animation="resultsAnimation"
                class="gap-8"
                item-class="x-tag-outlined"
              />
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
            panel-id="aside-panel"
          >
            Toggle Aside
          </BaseIdTogglePanelButton>
        </template>

        <template #toolbar-body>
          <div v-if="x.totalResults > 0" class="flex items-center gap-12">
            <span class="x-text1">{{ x.totalResults }} Results</span>
            <BaseColumnPickerList
              :model-value="selectedColumns"
              class="gap-4"
              :columns="columnPickerValues"
              @update:model-value="(col: any) => (selectedColumns = col)"
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
            class="p-28 flex flex-col gap-8 items-center bg-lead-25 x-my-8"
            :delay-in-seconds="5"
          >
            <p>Your search matches a special place in our website. You are being redirected to:</p>
            <a :href="redirection.url" data-test="redirection-link" @click="redirect">
              {{ redirection.url }}
            </a>
            <div class="flex gap-32">
              <button class="x-button--ghost x-button text-neutral-25" @click="abortRedirect">
                No, I'll stay here
              </button>
              <button class="x-button--ghost x-button text-neutral-90" @click="redirect">
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
              class="p-28 flex flex-col gap-8 items-center bg-lead-25 x-my-8"
              data-test="no-results-message"
            >
              <p>
                There are no results for
                <span class="font-bold">{{ x.query.search }}</span>
              </p>
              <p>You may be interested in these:</p>
            </div>
            <LocationProvider location="results">
              <AiOverview class="mb-28">
                <template #result="{ result }">
                  <Result :result="result" class="w-[150px]" />
                </template>
                <template #extra-content>
                  <button class="bg-lead-50 absolute bottom-0 right-0 translate-y-full">
                    extra content
                  </button>
                </template>
              </AiOverview>
            </LocationProvider>
            <template v-if="!x.query.searchBox">
              <!-- Brand Recommendations -->
              <h1 class="mb-16 x-title1">Brand Recommendations</h1>
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
                    :event-metadata="{ feature: 'customer' }"
                  >
                    <div class="flex flex-col gap-8 mb-16">
                      <QueryPreviewButton
                        class="w-fit x-button-xl x-button-ghost"
                        :query-preview-info="queryPreviewInfo"
                        :metadata="{ feature: 'customer' }"
                      >
                        {{ `${queryPreviewInfo.query} (${totalResults})` }}
                      </QueryPreviewButton>
                      <DisplayResultProvider :query-tagging="queryTagging">
                        <SlidingPanel :reset-on-content-change="false">
                          <div class="flex gap-8">
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
                          class="gap-12"
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
                                <span class="font-bold">{{ nextQueries[0].query }}</span>
                              </NextQuery>
                              <div class="mb-24">
                                <SlidingPanel :reset-on-content-change="false">
                                  <div class="flex flex-row gap-8">
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
                                class="x-button x-button-outlined rounded-full mx-auto mt-8 mb-24"
                              >
                                {{ 'View all results' }}
                              </NextQuery>
                            </NextQueryPreview>
                          </template>

                          <template #related-prompts-group>
                            <RelatedPromptsTagList
                              button-class="x-button-lead x-button-circle x-button-ghost p-0"
                              class="-mb-1 mt-24 desktop:mt-0 p-0 h-[70px]"
                              tag-class="rounded-xl gap-8 w-[300px] x-max-w-[400px]"
                              :tag-colors="['bg-amber-300', 'bg-amber-400', 'bg-amber-500']"
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
                                <div class="flex flex-col gap-8 mb-16">
                                  <QueryPreviewButton
                                    :query-preview-info="queryPreviewInfo"
                                    class="x-button x-button-lead x-button-tight x-title3 x-title3-sm desktop:x-title3-md max-desktop:px-16"
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
                                        <div class="flex gap-8">
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
              <section class="mt-28">
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
                      class="flex flex-col gap-8 mb-16"
                      data-test="semantic-query-preview"
                      :data-query="query"
                    >
                      <!-- eslint-disable vue/no-template-shadow -->
                      <!-- TODO: review why suggestion query renaming breaks e2e -->
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
                          <div class="flex gap-8">
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
            <ChevronUp />
          </ScrollToTop>
        </template>
      </MultiColumnMaxWidthLayout>
    </MainModal>
  </div>
  <BaseTeleport target="#teleport-here">This is the teleport content</BaseTeleport>
</template>

<script lang="ts">
import type { TaggingRequest } from '@empathyco/x-types'
import type { ComputedRef } from 'vue'
import type { QueryPreviewInfo } from '../../x-modules/queries-preview/store/types'
import type { HomeControls } from './types'
import { computed, defineComponent, provide, ref } from 'vue'
import { BaseTeleport } from '../../components'
import { animateClipPath } from '../../components/animations/animate-clip-path/animate-clip-path.factory'
import StaggeredFadeAndSlide from '../../components/animations/staggered-fade-and-slide.vue'
import AutoProgressBar from '../../components/auto-progress-bar.vue'
import BaseDropdown from '../../components/base-dropdown.vue'
import BaseGrid from '../../components/base-grid.vue'
import BaseVariableColumnGrid from '../../components/base-variable-column-grid.vue'
import BaseColumnPickerList from '../../components/column-picker/base-column-picker-list.vue'
import DisplayClickProvider from '../../components/display-click-provider.vue'
import DisplayEmitter from '../../components/display-emitter.vue'
import ArrowRightIcon from '../../components/icons/arrow-right.vue'
import ChevronLeft from '../../components/icons/chevron-left.vue'
import ChevronRight from '../../components/icons/chevron-right.vue'
import ChevronUp from '../../components/icons/chevron-up.vue'
import CrossIcon from '../../components/icons/cross.vue'
import Grid2Col from '../../components/icons/grid-2-col.vue'
import Grid4Col from '../../components/icons/grid-4-col.vue'
import SearchIcon from '../../components/icons/search.vue'
import MultiColumnMaxWidthLayout from '../../components/layouts/multi-column-max-width-layout.vue'
import LocationProvider from '../../components/location-provider.vue'
import CloseMainModal from '../../components/modals/close-main-modal.vue'
import MainModal from '../../components/modals/main-modal.vue'
import OpenMainModal from '../../components/modals/open-main-modal.vue'
import BaseIdTogglePanelButton from '../../components/panels/base-id-toggle-panel-button.vue'
import SlidingPanel from '../../components/sliding-panel.vue'
import SnippetCallbacks from '../../components/snippet-callbacks.vue'
import { use$x } from '../../composables/use-$x'
import { useState } from '../../composables/use-state'
import { infiniteScroll } from '../../directives/infinite-scroll'
import AiOverview from '../../x-modules/ai/components/ai-overview.vue'
import ExperienceControls from '../../x-modules/experience-controls/components/experience-controls.vue'
import RenderlessExtraParams from '../../x-modules/extra-params/components/renderless-extra-param.vue'
import SnippetConfigExtraParams from '../../x-modules/extra-params/components/snippet-config-extra-params.vue'
import PreselectedFilters from '../../x-modules/facets/components/preselected-filters.vue'
import NextQueriesList from '../../x-modules/next-queries/components/next-queries-list.vue'
import NextQueryPreview from '../../x-modules/next-queries/components/next-query-preview.vue'
import NextQuery from '../../x-modules/next-queries/components/next-query.vue'
import QueryPreviewButton from '../../x-modules/queries-preview/components/query-preview-button.vue'
import QueryPreviewList from '../../x-modules/queries-preview/components/query-preview-list.vue'
import { useQueriesPreview } from '../../x-modules/queries-preview/composables/use-queries-preview.composable'
import Recommendations from '../../x-modules/recommendations/components/recommendations.vue'
import RelatedPrompt from '../../x-modules/related-prompts/components/related-prompt.vue'
import RelatedPromptsList from '../../x-modules/related-prompts/components/related-prompts-list.vue'
import RelatedPromptsTagList from '../../x-modules/related-prompts/components/related-prompts-tag-list.vue'
import RelatedTags from '../../x-modules/related-tags/components/related-tags.vue'
import MainScrollItem from '../../x-modules/scroll/components/main-scroll-item.vue'
import ScrollToTop from '../../x-modules/scroll/components/scroll-to-top.vue'
import ClearSearchInput from '../../x-modules/search-box/components/clear-search-input.vue'
import SearchButton from '../../x-modules/search-box/components/search-button.vue'
import SearchInputPlaceholder from '../../x-modules/search-box/components/search-input-placeholder.vue'
import SearchInput from '../../x-modules/search-box/components/search-input.vue'
import Banner from '../../x-modules/search/components/banner.vue'
import BannersList from '../../x-modules/search/components/banners-list.vue'
import FallbackDisclaimer from '../../x-modules/search/components/fallback-disclaimer.vue'
import PartialQueryButton from '../../x-modules/search/components/partial-query-button.vue'
import PartialResultsList from '../../x-modules/search/components/partial-results-list.vue'
import Promoted from '../../x-modules/search/components/promoted.vue'
import PromotedsList from '../../x-modules/search/components/promoteds-list.vue'
import Redirection from '../../x-modules/search/components/redirection.vue'
import ResultsList from '../../x-modules/search/components/results-list.vue'
import SortPickerList from '../../x-modules/search/components/sort-picker-list.vue'
import SpellcheckButton from '../../x-modules/search/components/spellcheck-button.vue'
import Spellcheck from '../../x-modules/search/components/spellcheck.vue'
import SemanticQueries from '../../x-modules/semantic-queries/components/semantic-queries.vue'
import SemanticQuery from '../../x-modules/semantic-queries/components/semantic-query.vue'
import Tagging from '../../x-modules/tagging/components/tagging.vue'
import UrlHandler from '../../x-modules/url/components/url-handler.vue'
import { adapterConfig } from '../adapter'
import Aside from './aside.vue'
import DisplayResultProvider from './display-result-provider.vue'
import PredictiveLayer from './predictive-layer.vue'
import Result from './result.vue'

export default defineComponent({
  directives: {
    infiniteScroll,
  },
  components: {
    DisplayClickProvider,
    // eslint-disable-next-line vue/no-reserved-component-names
    Aside,
    AiOverview,
    AutoProgressBar,
    ArrowRightIcon,
    Banner,
    BannersList,
    BaseColumnPickerList,
    BaseDropdown,
    BaseGrid,
    BaseIdTogglePanelButton,
    BaseTeleport,
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
    RelatedPrompt,
    RelatedPromptsList,
    RelatedPromptsTagList,
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
    const toggleE2EAdapter = () => {
      adapterConfig.e2e = !adapterConfig.e2e
    }
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
      toggleE2EAdapter,
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
