<template>
  <main>
    <!-- Search Section -->
    <div>
      <SearchInput placeholder="Search" aria-label="Search for products" />
      <ClearSearchInput aria-label="Clear query">Clear</ClearSearchInput>
    </div>
    <!-- Query Suggestions Section -->
    <div class="x-column">
      <h1>Query Suggestions</h1>
      <QuerySuggestions>
        <template #suggestion="{ suggestion }">
          <QuerySuggestion
            :suggestion="suggestion"
            :aria-label="`Query suggestion: ${suggestion.query}`"
          />
        </template>
      </QuerySuggestions>
      <NoSuggestions message="We couldn't find any suggestion. Try searching for {query}." />
    </div>
    <!-- History Queries -->
    <div class="x-column">
      <h1>History queries</h1>
      <HistoryQueries>
        <template #suggestion-remove-content="{ suggestion }">
          <span :aria-label="`Remove ${suggestion.query} from history`"><CrossIcon /></span>
        </template>
      </HistoryQueries>
      <ClearHistoryQueries>Clear previous searches</ClearHistoryQueries>
    </div>
    <!-- Next Queries -->
    <div class="x-column">
      <h1>Next Queries</h1>
      <NextQueries />
    </div>
    <!-- Related Tags -->
    <div class="x-column">
      <h1>Related tags</h1>
      <RelatedTags class="x-list--horizontal x-list--wrap" />
    </div>
    <!-- Testing purpose -->
    <ul>
      <h1>Results</h1>
      <li v-for="result in results" :key="result.id" data-test="result-item">
        {{ result.name }}
      </li>
    </ul>
  </main>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import { deepMerge } from '@empathyco/x-deep-merge';
  import { Result } from '@empathyco/x-types-old';
  import { CrossIcon } from '../components/icons/index';
  // eslint-disable-next-line max-len
  import ClearHistoryQueries from '../x-modules/history-queries/components/clear-history-queries.vue';
  import HistoryQueries from '../x-modules/history-queries/components/history-queries.vue';
  import NoSuggestions from '../x-modules/no-suggestions/components/no-suggestions.vue';
  import ClearSearchInput from '../x-modules/search-box/components/clear-search-input.vue';
  import SearchInput from '../x-modules/search-box/components/search-input.vue';
  import QuerySuggestion from '../x-modules/query-suggestions/components/query-suggestion.vue';
  import QuerySuggestions from '../x-modules/query-suggestions/components/query-suggestions.vue';
  import NextQueries from '../x-modules/next-queries/components/next-queries.vue';
  import RelatedTags from '../x-modules/related-tags/components/related-tags.vue';
  import { State } from '../components/decorators/store.decorators';
  import { searchXModule } from '../x-modules/search/x-module';
  import { historyQueriesXModule } from '../x-modules/history-queries/x-module';
  import { XInstaller } from '../x-installer/x-installer';
  import { XPlugin } from '../plugins/x-plugin';
  import { baseInstallXOptions, baseSnippetConfig } from './base-config';

  @Component({
    beforeRouteEnter(to, _from, next: () => void): void {
      XPlugin.registerXModule(searchXModule);
      XPlugin.registerXModule(historyQueriesXModule);
      let customQueryConfig = JSON.parse(to.query.xModules?.toString() ?? '{}');
      const configQuerySuggestionsView = deepMerge(baseInstallXOptions, {
        xModules: deepMerge(customQueryConfig)
      });
      new XInstaller(configQuerySuggestionsView).init(baseSnippetConfig);
      next();
    },
    components: {
      CrossIcon,
      SearchInput,
      QuerySuggestion,
      QuerySuggestions,
      HistoryQueries,
      ClearHistoryQueries,
      ClearSearchInput,
      NextQueries,
      NoSuggestions,
      RelatedTags
    }
  })
  export default class QuerySuggestionsView extends Vue {
    /* Testing purpose */
    @State('search', 'results')
    public results!: Result[];
  }
</script>

<style lang="scss">
  .x-column {
    display: inline-flex;
    flex-direction: column;
    width: 30%;
  }
</style>
