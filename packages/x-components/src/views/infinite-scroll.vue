<template>
  <div>
    <h1>Infinite Scroll</h1>
    <header class="header">
      <SearchInput />
    </header>
    <BaseScroll id="test1" class="main">
      <ResultsList v-infinite-scroll:test1 />
    </BaseScroll>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import { Result } from '@empathy/search-types';
  import { State } from '../components/decorators/store.decorators';
  import Filters from '../x-modules/facets/components/lists/filters.vue';
  import HierarchicalFilter from '../x-modules/facets/components/filters/hierarchical-filter.vue';
  import SimpleFilter from '../x-modules/facets/components/filters/simple-filter.vue';
  import { XPlugin } from '../plugins/x-plugin';
  import { XInstaller } from '../x-installer/x-installer/x-installer';
  import ClearFilters from '../x-modules/facets/components/clear-filters.vue';
  import Facets from '../x-modules/facets/components/facets.vue';
  import MultiSelectFilters from '../x-modules/facets/components/lists/multi-select-filters.vue';
  import ClearSearchInput from '../x-modules/search-box/components/clear-search-input.vue';
  import SearchInput from '../x-modules/search-box/components/search-input.vue';
  import { searchXModule } from '../x-modules/search/x-module';
  import BaseDropdown from '../components/base-dropdown.vue';
  import ResultsList from '../x-modules/search/components/results-list.vue';
  import { infiniteScroll } from '../directives/infinite-scroll';
  import BaseScroll from '../components/scroll/base-scroll.vue';
  import { baseInstallXOptions, baseSnippetConfig } from './base-config';

  XPlugin.registerXModule(searchXModule);
  @Component({
    beforeRouteEnter(_to, _from, next: () => void): void {
      new XInstaller(baseInstallXOptions).init(baseSnippetConfig);
      next();
    },
    components: {
      BaseScroll,
      ResultsList,
      BaseDropdown,
      ClearFilters,
      HierarchicalFilter,
      SimpleFilter,
      MultiSelectFilters,
      Filters,
      Facets,
      ClearSearchInput,
      SearchInput
    },
    directives: {
      'infinite-scroll': infiniteScroll
    }
  })
  export default class Search extends Vue {
    @State('search', 'results')
    public results!: Result[];
  }
</script>

<style lang="scss">
  .main {
    background-color: red;
    height: 200px;
    overflow-y: auto;
  }

  .x-results-list {
    border: 1px solid black;
  }
</style>
