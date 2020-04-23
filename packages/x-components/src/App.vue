<template>
  <main>
    <SearchInput />
    <QuerySuggestions />
    <PopularSearches />
    <NextQueries />
    <HistoryQueries />
  </main>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import HistoryQueries from './x-modules/history-queries/components/history-queries.vue';
  import NextQueries from './x-modules/next-queries/components/next-queries.vue';
  import PopularSearches from './x-modules/popular-searches/components/popular-searches.vue';
  import QuerySuggestions from './x-modules/query-suggestions/components/query-suggestions.vue';
  import SearchInput from './x-modules/search-box/components/search-input.vue';

  @Component({
    components: {
      HistoryQueries,
      NextQueries,
      PopularSearches,
      QuerySuggestions,
      SearchInput
    }
  })
  export default class App extends Vue {}
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
