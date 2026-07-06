<template>
  <div class="x xds:text-neutral-90">
    <Tagging :consent="false" />
    <SnippetConfigExtraParams :values="initialExtraParams" />
    <PreselectedFilters />
    <UrlHandler query="q" store="store" />
    <SnippetCallbacks />
    <ExperienceControls />

    <OpenMainModal>Start</OpenMainModal>
    <h1 class="xds:text-4xl xds:leading-normal xds:font-bold">Test controls</h1>
    <ul class="x-test-controls xds:flex xds:flex-col xds:gap-16">
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

    <hr class="xds:mt-10 xds:text-neutral-25" />
    <h1 class="xds:text-4xl xds:leading-normal xds:font-bold">Teleport test</h1>
    <div id="teleport-here"></div>

    <HomeMainModal :controls="controls" />
  </div>
  <BaseTeleport target="#teleport-here">This is the teleport content</BaseTeleport>

  <div>
    <hr class="xds:mt-10 xds:text-neutral-25" />
    <h1 class="xds:text-4xl xds:leading-normal xds:font-bold">Browse test</h1>
    <div class="xds:flex xds:gap-8">
      <div class="xds:text-lg xds:font-semibold">Browse to...</div>
      <button
        class="xds:button"
        onclick="
          window.InterfaceX?.browse({ browseField: 'categoryIds', browseValue: '5b612edb5' })
        "
      >
        CategoryIds > dress
      </button>
      <button
        class="xds:button"
        onclick="
          window.InterfaceX?.browse({
            browseField: 'description',
            browseValue: 'floral print dress',
          })
        "
      >
        Description > floral print dress
      </button>
      <CloseMainModal class="xds:mr-64 xds:ml-auto xds:button xds:button-circle">
        <CrossIcon />
      </CloseMainModal>
    </div>
  </div>
  <div class="xds:layout-item xds:layout-expand xds:layout-no-margin-right">
    <BrowseSortPickerList
      v-slot="{ item }"
      :items="['', 'price asc', 'price desc']"
      class="xds:mt-24 xds:button-group xds:pl-24"
      button-class="xds:button xds:button-outlined"
    >
      {{ item || 'default' }}
    </BrowseSortPickerList>

    <div class="xds:flex xds:layout-expand xds:px-24 xds:pt-12">
      <!-- ASIDE -->
      <BaseIdTogglePanel
        v-show="x.browseTotalResults > 0"
        panel-id="aside-panel"
        :animation="asideAnimation"
        class="xds:w-1/5"
      >
        <Scroll id="aside-scroll" class="xds:h-full">
          <FacetsAside :controls="controls" />
        </Scroll>
      </BaseIdTogglePanel>

      <LocationProvider location="results">
        <BrowseResultsList v-infinite-scroll:main-scroll="{ margin: 600 }" data-wysiwyg="results">
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
          </BaseVariableColumnGrid>
        </BrowseResultsList>
      </LocationProvider>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { HomeControls } from './types'
import {
  AnimateWidth,
  BaseIdTogglePanel,
  BaseTeleport,
  BaseVariableColumnGrid,
  CloseMainModal,
  CrossIcon,
  LocationProvider,
  OpenMainModal,
  SnippetCallbacks,
  StaggeredFadeAndSlide,
} from '@x/components'
import { use$x } from '@x/composables/index'
import { infiniteScroll } from '@x/directives/index'
import { BrowseResultsList, BrowseSortPickerList } from '@x/x-modules/browse/index'
import { ExperienceControls } from '@x/x-modules/experience-controls'
import { SnippetConfigExtraParams } from '@x/x-modules/extra-params'
import { PreselectedFilters } from '@x/x-modules/facets'
import { MainScrollItem } from '@x/x-modules/scroll/index'
import { Tagging } from '@x/x-modules/tagging'
import { UrlHandler } from '@x/x-modules/url'
import { computed } from 'vue'
import Scroll from '../../../src/x-modules/scroll/components/scroll.vue'
import FacetsAside from './facets-aside.vue'
import HomeMainModal from './home-main-modal.vue'
import Result from './result.vue'

const controls = computed<HomeControls>(() => ({
  searchInput: { instant: true, instantDebounceInMs: 500 },
  popularSearches: { maxItemsToRender: 10 },
  slicedFilters: { max: 4 },
  historyQueries: { maxItemsToRender: 5 },
  nextQueriesPreview: { maxItemsToRender: 10 },
  nextQueriesList: { showOnlyAfterOffset: true },
  relatedPromptsList: { showOnlyAfterOffset: true },
}))

const initialExtraParams = { store: 'Portugal' }

const staggeredFadeAndSlideAnimation = StaggeredFadeAndSlide
const asideAnimation = AnimateWidth
const vInfiniteScroll = infiniteScroll

const x = use$x()
</script>
