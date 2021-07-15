<template>
  <main>
    <!-- Search Section -->
    <div>
      <SearchInput placeholder="Search" aria-label="Search for products" />
      <ClearSearchInput aria-label="Clear query">Clear</ClearSearchInput>
    </div>
    <!-- Query Suggestions -->
    <div class="x-column">
      <h1>Query Suggestions</h1>
      <QuerySuggestions />
      <NoSuggestions message="We couldn't find any suggestion. Try searching for {query}." />
    </div>
  </main>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import ClearSearchInput from '../x-modules/search-box/components/clear-search-input.vue';
  import NoSuggestions from '../x-modules/no-suggestions/components/no-suggestions.vue';
  import QuerySuggestion from '../x-modules/query-suggestions/components/query-suggestion.vue';
  import QuerySuggestions from '../x-modules/query-suggestions/components/query-suggestions.vue';
  import { XInstaller } from '../x-installer/x-installer';
  import SearchInput from '../x-modules/search-box/components/search-input.vue';
  import { baseInstallXOptions, baseSnippetConfig } from './base-config';

  @Component({
    beforeRouteEnter(_to, _from, next: () => void): void {
      new XInstaller(baseInstallXOptions).init(baseSnippetConfig);
      next();
    },
    components: {
      SearchInput,
      ClearSearchInput,
      NoSuggestions,
      QuerySuggestion,
      QuerySuggestions
    }
  })
  export default class NoSuggestionsView extends Vue {}
</script>

<style lang="scss">
  .x-column {
    display: inline-flex;
    flex-direction: column;
    width: 30%;
  }
</style>
