<template>
  <Scroll id="accessibility-scroll">
    <section class="x-list x-padding--07 x-list--gap-05">
      <div>
        <h1>BaseIdTogglePanelButton</h1>
        <BaseIdTogglePanelButton
          id="base-id-toggle-button"
          class="x-button x-button--ghost"
          panelId="aside-panel"
        >
          Panel
        </BaseIdTogglePanelButton>
        <BaseIdTogglePanel :startOpen="true" panelId="aside-panel">
          <div class="x-text">Hey there!</div>
        </BaseIdTogglePanel>
      </div>

      <div>
        <h1>ClearHistoryQueries and RemoveHistoryQuery</h1>
        <SearchInput />
        <ClearHistoryQueries>Not reading this since there is an aria-label</ClearHistoryQueries>
        <HistoryQueries :maxItemsToRender="3" />
      </div>

      <div>
        <h1>BaseResultAddToCart</h1>
        <BaseResultAddToCart id="result-add-to-cart" result="">
          <img src="https://picsum.photos/seed/200/50/50" alt="shopping cart" />
          <span>I want it!</span>
        </BaseResultAddToCart>
      </div>

      <div>
        <h1>AllFilter & ClearFilters</h1>
        <FacetsProvider :facets="[facet]" />
        <Facets>
          <template #default="{ facet }">
            <AllFilter :id="facet.label" :facet="facet">
              {{ facet.label }}
            </AllFilter>
            <Filters v-slot="{ filter }" :filters="facet.filters">
              <SimpleFilter :filter="filter" />
            </Filters>
          </template>
        </Facets>
        <ClearFilters />
      </div>

      <div>
        <h1>BaseColumnPickerList</h1>
        <BaseColumnPickerList #default="{ column }" :columns="[2, 4, 6]">
          <span>Not reading this since there is an aria-label {{ column }}</span>
        </BaseColumnPickerList>
      </div>

      <h1>ScrollToTop</h1>
      <div>
        <ScrollToTop scroll-id="accessibility-scroll" :threshold-px="1000">
          <span>^</span>
        </ScrollToTop>
      </div>
    </section>
  </Scroll>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import BaseIdTogglePanelButton from '../components/panels/base-id-toggle-panel-button.vue';
  import BaseIdTogglePanel from '../components/panels/base-id-toggle-panel.vue';
  import FacetsProvider from '../x-modules/facets/components/facets/facets-provider.vue';
  import AllFilter from '../x-modules/facets/components/filters/all-filter.vue';
  // eslint-disable-next-line max-len
  import ClearHistoryQueries from '../x-modules/history-queries/components/clear-history-queries.vue';
  import HistoryQueries from '../x-modules/history-queries/components/history-queries.vue';
  import MainScroll from '../x-modules/scroll/components/main-scroll.vue';
  import SearchInput from '../x-modules/search-box/components/search-input.vue';
  import BaseResultAddToCart from '../components/result/base-result-add-to-cart.vue';
  import ClearFilters from '../x-modules/facets/components/clear-filters.vue';
  import BaseColumnPickerList from '../components/column-picker/base-column-picker-list.vue';
  import SimpleFilter from '../x-modules/facets/components/filters/simple-filter.vue';
  import Filters from '../x-modules/facets/components/lists/filters-list.vue';
  import CheckboxCardSelectedIcon from '../components/icons/checkbox-card-selected.vue';
  import CheckboxCardUnselectedIcon from '../components/icons/checkbox-card-unselected.vue';
  import ScrollToTop from '../x-modules/scroll/components/scroll-to-top.vue';
  import BaseEventButton from '../components/base-event-button.vue';
  import { getSimpleFacetStub } from '../__stubs__';
  import Facets from '../x-modules/facets/components/facets/facets.vue';
  import Scroll from '../x-modules/scroll/components/scroll.vue';

  @Component({
    components: {
      MainScroll,
      FacetsProvider,
      AllFilter,
      BaseColumnPickerList,
      BaseEventButton,
      BaseIdTogglePanel,
      BaseIdTogglePanelButton,
      BaseResultAddToCart,
      CheckboxCardSelectedIcon,
      CheckboxCardUnselectedIcon,
      ClearFilters,
      ClearHistoryQueries,
      Facets,
      Filters,
      HistoryQueries,
      ScrollToTop,
      Scroll,
      SearchInput,
      SimpleFilter
    }
  })
  export default class AccessibilityCheck extends Vue {
    protected facet = getSimpleFacetStub();
  }
</script>

<style lang="scss" scoped>
  .x-scroll {
    height: 600px;
  }
</style>
