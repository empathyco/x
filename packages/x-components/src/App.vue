<template>
  <main>
    <SearchBox />
    <TermSuggestions />
    <PopularSearches />
    <NextQueries />
  </main>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import NextQueries from './x-modules/next-queries/next-queries.vue';
  import PopularSearches from './x-modules/popular-searches/popular-searches.vue';
  import SearchBox from './x-modules/search-box/search-box.vue';
  import TermSuggestions from './x-modules/term-suggestions/term-suggestions.vue';

  @Component({
    components: {
      NextQueries,
      PopularSearches,
      SearchBox,
      TermSuggestions
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
