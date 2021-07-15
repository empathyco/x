<template>
  <div>
    <BaseIdModalOpen modal-id="x-app">Start</BaseIdModalOpen>
    <BaseIdModal modal-id="x-app">
      <Layout>
        <template #header-middle>
          <div
            class="
              x-list x-list--vertical x-list--gap-05 x-list--align-stretch x-list__item--expand
            "
          >
            <div class="x-input-group x-input-group--card x-list__item--expand">
              <SearchInput placeholder="Search" aria-label="Search for products" />
              <ClearSearchInput aria-label="Clear query">Clear</ClearSearchInput>
              <SearchButton class="x-input-group__action" aria-label="Search">
                <SearchIcon />
              </SearchButton>
            </div>

            <SlidingPanel v-if="$x.relatedTags.length">
              <template #sliding-panel-left-button><ChevronLeft /></template>
              <RelatedTags class="x-tag--card x-list--gap-03" />
              <template #sliding-panel-right-button><ChevronRight /></template>
            </SlidingPanel>
          </div>
        </template>

        <template #header-end>
          <BaseIdModalClose class="x-button--ghost" modal-id="x-app">
            <CrossIcon />
          </BaseIdModalClose>
        </template>

        <template #empathize>
          <div class="x-list x-list--horizontal x-list--gap-06">
            <PopularSearches max-items-to-render="10" />
            <HistoryQueries max-items-to-render="10" />
            <QuerySuggestions max-items-to-render="10" />
            <NextQueries max-items-to-render="10" />
          </div>
        </template>

        <template #toolbar-aside>
          <BaseIdTogglePanelButton
            v-if="$x.totalResults > 0"
            panelId="aside-panel"
            class="x-button x-button--ghost"
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
            <BaseColumnPickerList #default="{ column }" :columns="columnPickerValues">
              <template v-if="column === 0">
                <ChevronTinyRight />
                <Grid1Col />
                <ChevronTinyLeft />
              </template>
              <Grid1Col v-else-if="column === 4" />
              <Grid2Col v-else-if="column === 6" />
            </BaseColumnPickerList>
            <SortDropdown class="x-option-list--bottom" :items="sortValues">
              <template #toggle="{ item }">{{ item || 'default' }}</template>
              <template #item="{ item }">{{ item || 'default' }}</template>
            </SortDropdown>
          </div>
        </template>

        <template #main-aside>
          <div
            v-if="$x.totalResults > 0"
            class="x-list x-list--padding-05 x-list--padding-top x-list--border x-list--border-top"
          >
            <Facets class="x-list--gap-06">
              <!--  Default Facet    -->
              <template #default="{ facet }">
                <BaseHeaderTogglePanel class="x-facet">
                  <template #header-content>
                    <span class="x-ellipsis">{{ facet.label }}</span>
                    <ChevronDown />
                  </template>
                  <MultiSelectFilters v-slot="{ filter }" :filters="facet.filters">
                    <SimpleFilter :filter="filter" />
                  </MultiSelectFilters>
                </BaseHeaderTogglePanel>
              </template>
            </Facets>
          </div>
        </template>

        <template #main-body>
          <!-- Recommendations -->
          <Recommendations
            v-if="!$x.query.search || $x.totalResults === 0"
            #layout="{ recommendations }"
          >
            <BaseVariableColumnGrid
              #default="{ item: result }"
              :items="recommendations"
              :animation="resultsAnimation"
            >
              <article class="result" style="max-width: 300px">
                <BaseResultImage class="x-picture--colored" :result="result">
                  <template #placeholder>
                    <div style="padding-top: 100%; background-color: lightgray"></div>
                  </template>
                  <template #fallback>
                    <div style="padding-top: 100%; background-color: lightsalmon"></div>
                  </template>
                </BaseResultImage>
                <h1 class="x-title3">{{ result.name }}</h1>
              </article>
            </BaseVariableColumnGrid>
          </Recommendations>

          <!-- Results -->
          <BannersList>
            <PromotedsList>
              <ResultsList v-infinite-scroll:body-scroll>
                <BaseVariableColumnGrid #Result="{ item: result }" :animation="resultsAnimation">
                  <article class="result" style="max-width: 300px">
                    <BaseResultImage class="x-picture--colored" :result="result">
                      <template #placeholder>
                        <div style="padding-top: 100%; background-color: lightgray"></div>
                      </template>
                      <template #fallback>
                        <div style="padding-top: 100%; background-color: lightsalmon"></div>
                      </template>
                    </BaseResultImage>
                    <h1 class="x-title3">{{ result.name }}</h1>
                  </article>
                </BaseVariableColumnGrid>
              </ResultsList>
            </PromotedsList>
          </BannersList>
        </template>

        <template #scroll-to-top>
          <BaseScrollToTop scroll-id="body-scroll" :threshold-px="500">
            <span>⬆</span>
          </BaseScrollToTop>
        </template>
      </Layout>
    </BaseIdModal>
  </div>
</template>

<script lang="ts">
  import { deepMerge } from '@empathyco/x-deep-merge';
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import { BaseIdTogglePanelButton } from '../components';
  import StaggeredFadeAndSlide from '../components/animations/staggered-fade-and-slide.vue';
  import BaseGrid from '../components/base-grid.vue';
  import BaseVariableColumnGrid from '../components/base-variable-column-grid.vue';
  import BaseColumnPickerList from '../components/column-picker/base-column-picker-list.vue';
  import ChevronDown from '../components/icons/chevron-down.vue';
  import ChevronLeft from '../components/icons/chevron-left.vue';
  import ChevronRight from '../components/icons/chevron-right.vue';
  import ChevronTinyLeft from '../components/icons/chevron-tiny-left.vue';
  import ChevronTinyRight from '../components/icons/chevron-tiny-right.vue';
  import Grid1Col from '../components/icons/grid-1-col.vue';
  import Grid2Col from '../components/icons/grid-2-col.vue';
  import Layout from '../components/layouts/layout.vue';
  import BaseIdModalClose from '../components/modals/base-id-modal-close.vue';
  import BaseIdModalOpen from '../components/modals/base-id-modal-open.vue';
  import BaseIdModal from '../components/modals/base-id-modal.vue';
  import BaseHeaderTogglePanel from '../components/panels/base-header-toggle-panel.vue';
  import BaseResultImage from '../components/result/base-result-image.vue';
  import SlidingPanel from '../components/sliding-panel.vue';
  import { infiniteScroll } from '../directives/infinite-scroll/infinite-scroll';
  import { XPlugin } from '../plugins/x-plugin';
  import { XInstaller } from '../x-installer/x-installer';
  import Facets from '../x-modules/facets/components/facets.vue';
  import SimpleFilter from '../x-modules/facets/components/filters/simple-filter.vue';
  import MultiSelectFilters from '../x-modules/facets/components/lists/multi-select-filters.vue';
  import HistoryQueries from '../x-modules/history-queries/components/history-queries.vue';
  import NextQueries from '../x-modules/next-queries/components/next-queries.vue';
  import PopularSearches from '../x-modules/popular-searches/components/popular-searches.vue';
  import QuerySuggestions from '../x-modules/query-suggestions/components/query-suggestions.vue';
  import Recommendations from '../x-modules/recommendations/components/recommendations.vue';
  import RelatedTags from '../x-modules/related-tags/components/related-tags.vue';
  import ClearSearchInput from '../x-modules/search-box/components/clear-search-input.vue';
  import SearchButton from '../x-modules/search-box/components/search-button.vue';
  import SearchInput from '../x-modules/search-box/components/search-input.vue';
  import ResultsList from '../x-modules/search/components/results-list.vue';
  import SortDropdown from '../x-modules/search/components/sort-dropdown.vue';
  import SortList from '../x-modules/search/components/sort-list.vue';
  import { searchXModule } from '../x-modules/search/x-module';
  import SearchIcon from '../components/icons/search.vue';
  import CrossIcon from '../components/icons/cross.vue';
  import BaseScrollToTop from '../components/scroll/base-scroll-to-top.vue';
  import BannersList from '../x-modules/search/components/banners-list.vue';
  import PromotedsList from '../x-modules/search/components/promoteds-list.vue';
  import { baseInstallXOptions, baseSnippetConfig } from './base-config';

  @Component({
    beforeRouteEnter(_to, _from, next: () => void): void {
      XPlugin.registerXModule(searchXModule);
      new XInstaller(
        deepMerge(baseInstallXOptions, {
          xModules: { recommendations: { config: { maxItemsToRequest: 48 } } }
        })
      ).init(baseSnippetConfig);
      next();
    },
    directives: {
      infiniteScroll
    },
    components: {
      PromotedsList,
      BannersList,
      BaseIdTogglePanelButton,
      BaseScrollToTop,
      ChevronDown,
      ChevronRight,
      ChevronLeft,
      ChevronTinyRight,
      ChevronTinyLeft,
      Grid2Col,
      Grid1Col,
      CrossIcon,
      SearchIcon,
      NextQueries,
      QuerySuggestions,
      HistoryQueries,
      RelatedTags,
      SlidingPanel,
      Recommendations,
      BaseResultImage,
      BaseVariableColumnGrid,
      BaseGrid,
      ResultsList,
      SortList,
      BaseColumnPickerList,
      SortDropdown,
      SimpleFilter,
      MultiSelectFilters,
      BaseHeaderTogglePanel,
      Facets,
      SearchButton,
      ClearSearchInput,
      BaseIdModalClose,
      BaseIdModalOpen,
      BaseIdModal,
      SearchInput,
      PopularSearches,
      Layout
    }
  })
  export default class App extends Vue {
    protected sortValues = ['', 'priceSort asc', 'priceSort desc'];
    protected columnPickerValues = [0, 4, 6];
    protected resultsAnimation = StaggeredFadeAndSlide;
  }
</script>

<style lang="scss" scoped>
  .x-modal::v-deep .x-modal__content {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
</style>
