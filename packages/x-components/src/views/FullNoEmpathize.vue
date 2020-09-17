<template>
  <main>
    <SearchInput placeholder="Search" aria-label="Search for products" />
    <ClearSearchInput aria-label="Clear query">Clear</ClearSearchInput>
    <BaseKeyboardNavigation>
      <div class="x-column">
        <h1>Query Suggestions</h1>
        <QuerySuggestions :animation="fadeAndSlide">
          <template #suggestion="{suggestion}">
            <QuerySuggestion
              :suggestion="suggestion"
              :aria-label="`Query suggestion: ${suggestion.query}`"
            />
          </template>
        </QuerySuggestions>
        <NoSuggestions message="We couldn't find any suggestion. Try searching for {query}." />
      </div>
      <div class="x-column">
        <h1>History queries</h1>
        <HistoryQueries :animation="fadeAndSlide">
          <template #suggestion-remove-content="{suggestion}">
            <span :aria-label="`Remove ${suggestion.query} from history`">x</span>
          </template>
        </HistoryQueries>
        <ClearHistoryQueries>Clear previous searches</ClearHistoryQueries>
      </div>
      <div class="x-column">
        <h1>Popular Searches</h1>
        <PopularSearches :animation="fadeAndSlide" />
      </div>
      <div class="x-column">
        <h1>Next Queries</h1>
        <NextQueries :animation="fadeAndSlide" :maxItemsToRender="10" />
      </div>
      <div class="x-column">
        <h1>Related tags</h1>
        <RelatedTags :animation="fadeAndSlide" />
      </div>
      <div class="x-column">
        <h1>Recommendations</h1>
        <Recommendations :animation="fadeAndSlide">
          <template #default="{ recommendation }">
            <BaseResultLink :result="recommendation" class="x-result-link">
              <template #default="{ result }">
                <img :src="result.images[0]" :alt="result.name" class="x-result_image x-column" />
                <span class="x-result__title">{{ result.name }}</span>
              </template>
            </BaseResultLink>
          </template>
        </Recommendations>
      </div>
      <div class="inline-flex">
        <h1>Identifier Results</h1>
        <IdentifierResults :animation="fadeAndSlide">
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
  </main>
</template>

<script lang="ts">
  import { deepMerge } from '@empathybroker/deep-merge';
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import FadeAndSlide from '../components/animations/fade-and-slide.vue';
  import BaseKeyboardNavigation from '../components/base-keyboard-navigation.vue';
  import BaseResultLink from '../components/base-result-link.vue';
  import { XInstaller } from '../x-installer/x-installer';
  // eslint-disable-next-line max-len
  import ClearHistoryQueries from '../x-modules/history-queries/components/clear-history-queries.vue';
  import HistoryQueries from '../x-modules/history-queries/components/history-queries.vue';
  import IdentifierResult from '../x-modules/identifier-results/components/identifier-result.vue';
  import IdentifierResults from '../x-modules/identifier-results/components/identifier-results.vue';
  import NextQueries from '../x-modules/next-queries/components/next-queries.vue';
  import NoSuggestions from '../x-modules/no-suggestions/components/no-suggestions.vue';
  import PopularSearches from '../x-modules/popular-searches/components/popular-searches.vue';
  import QuerySuggestion from '../x-modules/query-suggestions/components/query-suggestion.vue';
  import QuerySuggestions from '../x-modules/query-suggestions/components/query-suggestions.vue';
  import Recommendations from '../x-modules/recommendations/components/recommendations.vue';
  import RelatedTags from '../x-modules/related-tags/components/related-tags.vue';
  import ClearSearchInput from '../x-modules/search-box/components/clear-search-input.vue';
  import SearchInput from '../x-modules/search-box/components/search-input.vue';
  import { baseInstallXOptions, baseSnippetConfig } from './base-config';

  @Component({
    beforeRouteEnter(_to, _from, next: () => void): void {
      const configFullNoEmpathize = deepMerge(baseInstallXOptions, {
        xModules: {
          nextQueries: {
            config: {
              loadOnInit: true
            }
          }
        }
      });
      new XInstaller(configFullNoEmpathize).init(baseSnippetConfig);
      next();
    },
    components: {
      SearchInput,
      ClearSearchInput,
      BaseKeyboardNavigation,
      BaseResultLink,
      ClearHistoryQueries,
      HistoryQueries,
      IdentifierResult,
      IdentifierResults,
      NextQueries,
      NoSuggestions,
      PopularSearches,
      QuerySuggestion,
      QuerySuggestions,
      Recommendations,
      RelatedTags
    }
  })
  export default class FullNoEmpathize extends Vue {
    protected fadeAndSlide = FadeAndSlide;
  }
</script>

<style lang="scss">
  .x-column {
    display: inline-flex;
    flex-direction: column;
    width: 30%;
  }
</style>
