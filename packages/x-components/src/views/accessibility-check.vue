<template>
  <section class="x-list x-padding--07 x-list--gap-05">
    <div>
      <h1>BaseIdTogglePanelButton</h1>
      <BaseIdTogglePanelButton
        id="toggle-panel"
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
      <h1>AllFilter</h1>
      <!--      This is a checkbox-->
      <AllFilter :facet="facet">All filter</AllFilter>
    </div>

    <div>
      <h1>ClearHistoryQueries and RemoveHistoryQuery</h1>
      <SearchInput />
      <ClearHistoryQueries>Not reading this since there is a label</ClearHistoryQueries>
      <HistoryQueries :maxItemsToRender="3" />
    </div>

    <div>
      <h1>BaseResultAddToCart</h1>
      <BaseResultAddToCart result="">
        <img src="https://picsum.photos/seed/200/50/50" alt="random image" />
        <span>Add to cart</span>
      </BaseResultAddToCart>
    </div>

    <div>
      <h1>ClearFilters</h1>
      <ClearFilters>Clear all filters</ClearFilters>
    </div>

    <div>
      <h1>BaseColumnPickerList</h1>
      <BaseColumnPickerList #default="{ column }" :columns="[2, 4, 6]">
        <span>{{ column }}⇋</span>
      </BaseColumnPickerList>
    </div>

    <div>
      <h1>ScrollToTop</h1>
      <!--<ScrollToTop :threshold-px="500" class="x-button&#45;&#45;round" scroll-id="main-scroll">
              <ChevronUp />
            </ScrollToTop>-->
    </div>
  </section>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import BaseIdTogglePanelButton from '../components/panels/base-id-toggle-panel-button.vue';
  import BaseIdTogglePanel from '../components/panels/base-id-toggle-panel.vue';
  import ScrollToTop from '../x-modules/scroll/components/scroll-to-top.vue';
  import AllFilter from '../x-modules/facets/components/filters/all-filter.vue';
  // eslint-disable-next-line max-len
  import ClearHistoryQueries from '../x-modules/history-queries/components/clear-history-queries.vue';
  import HistoryQueries from '../x-modules/history-queries/components/history-queries.vue';
  import SearchInput from '../x-modules/search-box/components/search-input.vue';
  import BaseResultAddToCart from '../components/result/base-result-add-to-cart.vue';
  import ClearFilters from '../x-modules/facets/components/clear-filters.vue';
  import BaseColumnPickerList from '../components/column-picker/base-column-picker-list.vue';
  import SimpleFilter from '../x-modules/facets/components/filters/simple-filter.vue';

  @Component({
    components: {
      AllFilter,
      BaseColumnPickerList,
      BaseIdTogglePanel,
      BaseIdTogglePanelButton,
      BaseResultAddToCart,
      ClearFilters,
      ClearHistoryQueries,
      HistoryQueries,
      ScrollToTop,
      SearchInput,
      SimpleFilter
    }
  })
  export default class AccessibilityCheck extends Vue {
    public facet = {
      filters: ['a', 'b', 'c'],
      label: 'letras'
    };
  }
</script>
