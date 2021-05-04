<template>
  <Empathize :animation="collapseFromTop">
    <BaseKeyboardNavigation>
      <PopularSearches v-if="$x.popularSearches.length > 0 && !$x.query.searchBox" />
      <NextQueries v-if="$x.nextQueries.length > 0 && !$x.query.searchBox" />
      <QuerySuggestions
        v-if="$x.querySuggestions.length > 0 && $x.identifierResults.length === 0"
      />
      <HistoryQueries v-if="$x.historyQueries.length > 0 && !$x.query.searchBox" />
      <IdentifierResults v-if="$x.identifierResults.length > 0" />
    </BaseKeyboardNavigation>
  </Empathize>
</template>

<script lang="ts">
  import { Empathize } from '@empathy/x-components/empathize';
  import { BaseKeyboardNavigation, CollapseFromTop } from '@empathy/x-components';
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import IdentifierResultsComponent from './identifier-results.vue';
  import NextQueriesComponent from './next-queries.vue';
  import PopularSearchesComponent from './popular-searches.vue';
  import QuerySuggestionsComponent from './query-suggestions.vue';
  import HistoryQueriesComponent from './history-queries.vue';

  @Component({
    components: {
      IdentifierResults: IdentifierResultsComponent,
      QuerySuggestions: QuerySuggestionsComponent,
      NextQueries: NextQueriesComponent,
      PopularSearches: PopularSearchesComponent,
      HistoryQueries: HistoryQueriesComponent,
      BaseKeyboardNavigation,
      Empathize
    }
  })
  export default class EmpathizeComponent extends Vue {
    public collapseFromTop = CollapseFromTop;
  }
</script>
