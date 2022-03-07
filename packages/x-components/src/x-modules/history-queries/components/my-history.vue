<template>
  <BaseSuggestions #default="{ suggestion, index }" :suggestions="historyQueries">
    <slot v-bind="{ suggestion, index }">
      {{ suggestion.query }}
    </slot>
  </BaseSuggestions>
</template>

<script lang="ts">
  import { HistoryQuery } from '@empathyco/x-types';
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import { State, xComponentMixin } from '../../../components';
  import BaseSuggestions from '../../../components/suggestions/base-suggestions.vue';
  import { historyQueriesXModule } from '../x-module';
  import HistoryQueryComponent from './history-query.vue';

  @Component({
    components: { HistoryQuery: HistoryQueryComponent, BaseSuggestions },
    mixins: [xComponentMixin(historyQueriesXModule)]
  })
  export default class MyHistory extends Vue {
    @State('historyQueries', 'historyQueries')
    public historyQueries!: HistoryQuery[];
  }
</script>

<style scoped></style>
