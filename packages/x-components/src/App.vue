<template>
  <main>
    <SearchInput />
    <ClearSearchInput />
    <h1>Query Suggestions</h1>
    <QuerySuggestions />
    <h1>History</h1>
    <HistoryQueries />
    <ClearHistoryQueries />
    <h1>Popular Searches</h1>
    <PopularSearches />
    <h1>Next Queries</h1>
    <NextQueries :loadOnInit="loadOnInit" />
    <h1>Related tags</h1>
    <RelatedTags />
  </main>
</template>

<script lang="ts">
  import Vue from "vue";
  import { Component } from "vue-property-decorator";
  import { getURLParameter } from './utils/get-url-parameters';
  import HistoryQueries from "./x-modules/history-queries/components/history-queries.vue";
  import NextQueries from "./x-modules/next-queries/components/next-queries.vue";
  // eslint-disable-next-line max-len
  import ClearHistoryQueries from "./x-modules/history-queries/components/clear-history-queries.vue";
  import PopularSearches from "./x-modules/popular-searches/components/popular-searches.vue";
  import QuerySuggestions from "./x-modules/query-suggestions/components/query-suggestions.vue";
  import RelatedTags from './x-modules/related-tags/components/related-tags.vue';
  import ClearSearchInput from "./x-modules/search-box/components/clear-search-input.vue";
  import SearchInput from "./x-modules/search-box/components/search-input.vue";

  @Component({
    components: {
      RelatedTags,
      ClearSearchInput,
      ClearHistoryQueries,
      HistoryQueries,
      NextQueries,
      PopularSearches,
      QuerySuggestions,
      SearchInput
    }
  })
  export default class App extends Vue {
    protected loadOnInit = getURLParameter('loadOnInit') === 'true';
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
</style>
