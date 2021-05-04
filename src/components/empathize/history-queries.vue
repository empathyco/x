<template>
  <div>
    <h1>{{ $t('historyQueries.title') }}</h1>
    <HistoryQueries :animation="historyQueriesAnimation" :max-items-to-render="maxItemsToRender">
      <template #suggestion="{ suggestion }">
        <HistoryQuery :suggestion="suggestion">
          <template #remove-button-content>
            <span :aria-label="$t('historyQueries.removeLabel', { suggestion: suggestion.query })">
              &#215;
            </span>
          </template>
        </HistoryQuery>
      </template>
    </HistoryQueries>
    <ClearHistoryQueries>{{ $t('historyQueries.clear') }}</ClearHistoryQueries>
  </div>
</template>

<script lang="ts">
  import { FadeAndSlide } from '@empathy/x-components';
  import {
    ClearHistoryQueries,
    HistoryQueries,
    HistoryQuery
  } from '@empathy/x-components/history-queries';
  import { Component, Vue } from 'vue-property-decorator';

  @Component({
    components: {
      ClearHistoryQueries,
      HistoryQueries,
      HistoryQuery
    }
  })
  export default class HistoryQueriesComponent extends Vue {
    public historyQueriesAnimation = FadeAndSlide;
    protected maxItemsToRender = 5;
  }
</script>
