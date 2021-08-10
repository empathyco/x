<template>
  <main>
    <!-- Search Section -->
    <div>
      <SearchInput placeholder="Search" aria-label="Search for products" />
      <ClearSearchInput aria-label="Clear query">Clear</ClearSearchInput>
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
  import { CrossIcon } from '../components/icons/index';
  // eslint-disable-next-line max-len
  import ClearHistoryQueries from '../x-modules/history-queries/components/clear-history-queries.vue';
  import HistoryQueries from '../x-modules/history-queries/components/history-queries.vue';
  import ClearSearchInput from '../x-modules/search-box/components/clear-search-input.vue';
  import NextQueries from '../x-modules/next-queries/components/next-queries.vue';
  import SearchButton from '../x-modules/search-box/components/search-button.vue';
  import SearchInput from '../x-modules/search-box/components/search-input.vue';
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
      const customQueryConfig = JSON.parse(to.query.xModules?.toString() ?? '{}');
      const configNextQueriesView = deepMerge(baseInstallXOptions, {
        xModules: customQueryConfig
      });
      new XInstaller(configNextQueriesView).init(baseSnippetConfig);
      next();
    },
    components: {
      CrossIcon,
      SearchButton,
      SearchInput,
      HistoryQueries,
      ClearHistoryQueries,
      ClearSearchInput,
      NextQueries
    }
  })
  export default class NextQueriesView extends Vue {
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
