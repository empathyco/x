<template>
  <div class="x-layout">
    <header class="x-header">
      <Close modalId="x-components-app">Close X</Close>
      <SearchBox />
      <Empathize />
      <RelatedTags :animation="staggeredFadeAndSlide" />
    </header>

    <aside class="x-facets">
      <SelectedFilters>
        <template #default="{ selectedFilters }">
          Filters selected: {{ selectedFilters.length }}
        </template>
      </SelectedFilters>
      <SelectedFiltersList />
      <ClearFilters v-slot="{ selectedFilters }" :alwaysVisible="false">
        Clear {{ selectedFilters.length }} filters
      </ClearFilters>
      <Facets />
    </aside>

    <nav v-if="$x.totalResults" class="x-toolbar">
      <ColumnPicker :columns="[4, 6]" />
      <Sort />
    </nav>

    <main class="x-body">
      <Spellcheck />

      <div v-if="!$x.totalResults && $x.query.searchBox" class="x-no-results">
        <span>No results found for '{{ $x.query.search }}'.Try with another query.</span>
      </div>

      <Scroll id="mainScroll" class="x-scroll">
        <Recommendations v-if="!$x.totalResults" />
        <Results />
        <PartialResults />
      </Scroll>

      <ScrollToTop scroll-id="mainScroll" :threshold-px="100">⬆</ScrollToTop>
    </main>
  </div>
</template>

<script lang="ts">
  import { RelatedTags } from '@empathy/x-components/related-tags';
  import { ClearFilters, SelectedFiltersList, SelectedFilters } from '@empathy/x-components/facets';
  import {
    BaseIdScroll,
    BaseColumnPickerList,
    BaseScrollToTop,
    StaggeredFadeAndSlide,
    BaseIdModalClose
  } from '@empathy/x-components';
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import { Sort, Spellcheck } from './body';
  import { Empathize } from './empathize';
  import { Facet, Facets } from './facets';
  import { PartialResults, Recommendations, Results } from './results';
  import SearchBox from './search-box.vue';

  @Component({
    components: {
      Scroll: BaseIdScroll,
      Close: BaseIdModalClose,
      Recommendations,
      Empathize,
      Facets,
      Facet,
      SearchBox,
      Spellcheck,
      RelatedTags,
      ClearFilters,
      SelectedFiltersList,
      SelectedFilters,
      Results,
      ColumnPicker: BaseColumnPickerList,
      ScrollToTop: BaseScrollToTop,
      Sort,
      PartialResults
    }
  })
  export default class Layout extends Vue {
    protected staggeredFadeAndSlide = StaggeredFadeAndSlide;
  }
</script>

<style scoped>
  .x-layout {
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
  }
  .x-body {
    display: flex;
    flex-flow: column nowrap;
  }

  .x-body,
  .x-scroll {
    flex: 1 1 1px;
  }
</style>
