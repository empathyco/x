<template>
  <main>
    <h1>Test controls</h1>
    <ul class="x-test-controls">
      <li class="x-test-controls__control">
        <label>
          <input
            v-model="controls.searchInput.instant"
            type="checkbox"
            data-test="search-input-instant"
          />
          search-input - instant
        </label>
      </li>
      <li class="x-test-controls__control">
        <label for="searchInput.instantDebounceInMs">search-input - debounce</label>
        <input
          v-model="controls.searchInput.instantDebounceInMs"
          id="searchInput.instantDebounceInMs"
          type="number"
          data-test="search-input-debounce"
        />
      </li>
    </ul>
    <!-- Search Section -->
    <div>
      <SearchInput
        placeholder="Search"
        aria-label="Search for products"
        :instant="controls.searchInput.instant"
        :instant-debounce-in-ms="controls.searchInput.instantDebounceInMs"
      />
      <ClearSearchInput aria-label="Clear query">Clear</ClearSearchInput>
      <SearchButton aria-label="Search">
        <SearchIcon />
      </SearchButton>
    </div>
    <!-- Query Suggestions -->
    <div class="x-column">
      <h1>Query Suggestions</h1>
      <QuerySuggestions />
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
  import { Result } from '@empathyco/x-types';
  import { CrossIcon, SearchIcon } from '../components/icons/index';
  // eslint-disable-next-line max-len
  import ClearHistoryQueries from '../x-modules/history-queries/components/clear-history-queries.vue';
  import ClearSearchInput from '../x-modules/search-box/components/clear-search-input.vue';
  import HistoryQueries from '../x-modules/history-queries/components/history-queries.vue';
  import NextQueries from '../x-modules/next-queries/components/next-queries.vue';
  import QuerySuggestion from '../x-modules/query-suggestions/components/query-suggestion.vue';
  import QuerySuggestions from '../x-modules/query-suggestions/components/query-suggestions.vue';
  import RelatedTags from '../x-modules/related-tags/components/related-tags.vue';
  import SearchButton from '../x-modules/search-box/components/search-button.vue';
  import SearchInput from '../x-modules/search-box/components/search-input.vue';
  import { State } from '../components/decorators/store.decorators';
  import { searchXModule } from '../x-modules/search/x-module';
  import { XInstaller } from '../x-installer/x-installer';
  import { XPlugin } from '../plugins/x-plugin';
  import { baseInstallXOptions, baseSnippetConfig } from './base-config';

  @Component({
    beforeRouteEnter(to, _from, next: () => void): void {
      XPlugin.registerXModule(searchXModule);
      let customQueryConfig = JSON.parse(to.query.xModules?.toString() ?? '{}');
      const configSearchBoxView = deepMerge(baseInstallXOptions, {
        xModules: deepMerge(
          {
            nextQueries: {
              config: {
                loadOnInit: true
              }
            }
          },
          customQueryConfig
        )
      });
      new XInstaller(configSearchBoxView).init(baseSnippetConfig);
      next();
    },
    components: {
      CrossIcon,
      SearchButton,
      ClearHistoryQueries,
      ClearSearchInput,
      HistoryQueries,
      NextQueries,
      QuerySuggestion,
      QuerySuggestions,
      RelatedTags,
      SearchInput,
      SearchIcon
    }
  })
  export default class SearchBoxView extends Vue {
    /* Controls */
    protected controls = {
      searchInput: {
        instant: true,
        instantDebounceInMs: 500 // default
      }
    };

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
