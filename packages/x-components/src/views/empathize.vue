<template>
  <main>
    <SearchInput placeholder="Search" aria-label="Search for products" />
    <ClearSearchInput aria-label="Clear query">Clear</ClearSearchInput>
    <Empathize :animation="collapseFromTop">
      <BaseKeyboardNavigation>
        <div class="x-column">
          <h1>Query Suggestions</h1>
          <QuerySuggestions :animation="fadeAndSlide" />
        </div>
        <div class="x-column">
          <h1>History queries</h1>
          <HistoryQueries :animation="fadeAndSlide" />
          <ClearHistoryQueries>Clear previous searches</ClearHistoryQueries>
        </div>
        <div class="x-column">
          <h1>Popular Searches</h1>
          <PopularSearches />
        </div>
        <div class="x-column">
          <h1>Next Queries</h1>
          <NextQueries :animation="fadeAndSlide" :maxItemsToRender="10" />
        </div>
        <div class="x-column">
          <h1>Related tags</h1>
          <RelatedTags />
        </div>
        <div class="x-column">
          <h1>Recommendations</h1>
          <Recommendations :animation="fadeAndSlide" :maxItemsToRender="5" />
        </div>
        <div class="inline-flex">
          <h1>Identifier Results</h1>
          <IdentifierResults>
            <template #default="{ identifierResult }">
              <BaseResultLink :result="identifierResult">
                <template #default="{ result }">
                  <IdentifierResult :result="result" />
                </template>
              </BaseResultLink>
            </template>
          </IdentifierResults>
        </div>
      </BaseKeyboardNavigation>
    </Empathize>
  </main>
</template>

<script lang="ts">
  import { deepMerge } from '@empathybroker/deep-merge';
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import CollapseFromTop from '../components/animations/collapse-from-top.vue';
  import FadeAndSlide from '../components/animations/fade-and-slide.vue';
  import BaseKeyboardNavigation from '../components/base-keyboard-navigation.vue';
  import BaseResultLink from '../components/result/base-result-link.vue';
  import { XInstaller } from '../x-installer/x-installer';
  import Empathize from '../x-modules/empathize/components/empathize.vue';
  // eslint-disable-next-line max-len
  import ClearHistoryQueries from '../x-modules/history-queries/components/clear-history-queries.vue';
  import HistoryQueries from '../x-modules/history-queries/components/history-queries.vue';
  import IdentifierResult from '../x-modules/identifier-results/components/identifier-result.vue';
  import IdentifierResults from '../x-modules/identifier-results/components/identifier-results.vue';
  import NextQueries from '../x-modules/next-queries/components/next-queries.vue';
  import PopularSearches from '../x-modules/popular-searches/components/popular-searches.vue';
  import QuerySuggestion from '../x-modules/query-suggestions/components/query-suggestion.vue';
  import QuerySuggestions from '../x-modules/query-suggestions/components/query-suggestions.vue';
  import Recommendations from '../x-modules/recommendations/components/recommendations.vue';
  import RelatedTags from '../x-modules/related-tags/components/related-tags.vue';
  import ClearSearchInput from '../x-modules/search-box/components/clear-search-input.vue';
  import SearchInput from '../x-modules/search-box/components/search-input.vue';
  import { baseInstallXOptions, baseSnippetConfig } from './base-config';

  @Component({
    beforeRouteEnter(to, _from, next: () => void): void {
      const customQueryConfig = JSON.parse(to.query.xModules?.toString() ?? '{}');
      const configEmpathizeView = deepMerge(baseInstallXOptions, {
        xModules: customQueryConfig
      });
      new XInstaller(configEmpathizeView).init(baseSnippetConfig);
      next();
    },
    components: {
      ClearSearchInput,
      BaseKeyboardNavigation,
      BaseResultLink,
      ClearHistoryQueries,
      Empathize,
      HistoryQueries,
      IdentifierResult,
      IdentifierResults,
      NextQueries,
      PopularSearches,
      QuerySuggestion,
      QuerySuggestions,
      Recommendations,
      RelatedTags,
      SearchInput
    }
  })
  export default class FullEmpathize extends Vue {
    protected fadeAndSlide = FadeAndSlide;
    protected collapseFromTop = CollapseFromTop;
  }
</script>

<style lang="scss" scoped>
  .x-column {
    display: inline-flex;
    flex-direction: column;
    width: 30%;
  }

  .x-empathize {
    background-color: white;
    border: 1px dashed black;
    border-radius: 20px;
    z-index: 2;
    position: relative;

    &__close {
      position: absolute;
      top: 20px;
      right: 20px;
    }
  }

  .x-related-tags {
    flex-flow: row wrap;
  }
</style>
