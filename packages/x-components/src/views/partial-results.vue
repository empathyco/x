<template>
  <main>
    <!-- Search Box -->
    <div class="x-search-box x-input-group x-input-group--card">
      <SearchInput placeholder="Search" aria-label="Search for products" />
      <ClearSearchInput aria-label="Clear query">Clear</ClearSearchInput>
      <SearchButton class="x-input-group__action" aria-label="Search"></SearchButton>
    </div>

    <!-- Results -->
    <h1 class="x-title1">Results {{ results.length }} / {{ $x.totalResults }}</h1>
    <ResultsList #default="{ items, animation }" :animation="staggeredFadeAndSlide">
      <BaseGrid :animation="animation" :items="items" :columns="4">
        <template #Result="{ item }">
          <BaseResultLink :result="item" data-test="regular-result">
            <template #default="{ result }">
              <BaseResultImage :result="result" />
              <span>{{ result.name }}</span>
            </template>
          </BaseResultLink>
        </template>
      </BaseGrid>
    </ResultsList>

    <!-- Partial Results -->
    <h1 class="x-title1">Partial Results</h1>
    <PartialResultsList :animation="staggeredFadeAndSlide">
      <template #default="{ partialResult }">
        <span data-test="partial-query">{{ partialResult.query }}</span>
        <BaseGrid :animation="staggeredFadeAndSlide" :columns="4" :items="partialResult.results">
          <template #Result="{ item }">
            <BaseResultLink :result="item" class="x-result-link">
              <BaseResultImage :result="item" />
              <span class="x-result__title" data-test="partial-result-item">{{ item.name }}</span>
            </BaseResultLink>
          </template>
        </BaseGrid>
        <PartialQueryButton :query="partialResult.query">
          <template #default="{ query }">{{ query }}</template>
        </PartialQueryButton>
      </template>
    </PartialResultsList>
  </main>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import { Result } from '@empathyco/x-types-old';
  import BaseGrid from '../components/base-grid.vue';
  import BaseResultLink from '../components/result/base-result-link.vue';
  import BaseResultImage from '../components/result/base-result-image.vue';
  import PartialQueryButton from '../x-modules/search/components/partial-query-button.vue';
  import PartialResultsList from '../x-modules/search/components/partial-results-list.vue';
  import ClearSearchInput from '../x-modules/search-box/components/clear-search-input.vue';
  import CollapseFromTop from '../components/animations/collapse-from-top.vue';
  import FadeAndSlide from '../components/animations/fade-and-slide.vue';
  import SearchButton from '../x-modules/search-box/components/search-button.vue';
  import SearchInput from '../x-modules/search-box/components/search-input.vue';
  import StaggeredFadeAndSlide from '../components/animations/staggered-fade-and-slide.vue';
  import { State } from '../components/decorators/store.decorators';
  import ResultsList from '../x-modules/search/components/results-list.vue';
  import { searchXModule } from '../x-modules/search/x-module';
  import { XInstaller } from '../x-installer/x-installer';
  import { XPlugin } from '../plugins/x-plugin';
  import { baseInstallXOptions, baseSnippetConfig } from './base-config';

  @Component({
    beforeRouteEnter(_to, _from, next: () => void): void {
      XPlugin.registerXModule(searchXModule);
      new XInstaller(baseInstallXOptions).init(baseSnippetConfig);
      next();
    },
    components: {
      PartialQueryButton,
      PartialResultsList,
      ResultsList,
      BaseGrid,
      BaseResultLink,
      BaseResultImage,
      ClearSearchInput,
      SearchButton,
      SearchInput
    }
  })
  export default class App extends Vue {
    protected fadeAndSlide = FadeAndSlide;
    protected staggeredFadeAndSlide = StaggeredFadeAndSlide;
    protected collapseFromTop = CollapseFromTop;

    @State('search', 'results')
    public results!: Result[];
  }
</script>

<style lang="scss">
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    margin-top: 60px;
    text-align: center;
    color: #2c3e50;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .x-search-box {
    max-width: 400px;
  }

  .x-base-grid {
    column-gap: 10px;
    row-gap: 10px;

    &__item {
      padding: 20px 0;
      text-align: center;
      border: 1px solid black;
      border-radius: 5px;
    }
  }
</style>
