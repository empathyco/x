<template>
  <Suggestions :suggestions="historyQueries" class="x-history-queries">
    <template #default="{ suggestion }">
      <!-- @slot Slot for an individual History Query item. -->
      <!-- @binding {Suggestion} suggestion - The data of the History Query's suggestion. -->
      <slot name="suggestion" :suggestion="suggestion">
        <HistoryQuery
          :suggestion="suggestion"
          data-test="history-query-item"
          class="x-history-queries__history-query"
        >
          <template #default="suggestionContentProps">
            <!-- @slot Slot for the History Query's content. -->
            <!-- @binding suggestionContentProps - The data of the Popular Search's suggestion. -->
            <slot name="suggestion-content" v-bind="suggestionContentProps" />
          </template>
          <template #delete-button-content="suggestionDeleteContentProps">
            <!-- @slot Slot for the History Query's delete button content. -->
            <!-- @binding suggestionContentProps - The data of the Popular Search's suggestion. -->
            <slot name="suggestion-delete-content" v-bind="suggestionDeleteContentProps" />
          </template>
        </HistoryQuery>
      </slot>
    </template>
  </Suggestions>
</template>

<script lang="ts">
  import { HistoryQuery as HistoryQueryModel } from '@empathy/search-types';
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import { Getter } from '../../../components/decorators';
  import Suggestions from '../../../components/pure/suggestions.vue';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { historyQueriesXModule } from '../x-module';
  import HistoryQuery from './history-query.vue';

  /**
   * This component renders a list of suggestions coming from the user queries history.
   *
   * @remarks
   *
   * Allows the user to select one of them, emitting the needed events.
   * A history query is just another type of suggestion that contains a query that the user has
   * made in the past.
   *
   * @public
   */
  @Component({
    components: { Suggestions, HistoryQuery },
    mixins: [xComponentMixin(historyQueriesXModule)]
  })
  export default class HistoryQueries extends Vue {
    /**
     * The filtered list of history queries.
     *
     * @internal
     */
    @Getter('historyQueries', 'historyQueries')
    public historyQueries!: HistoryQueryModel[];
  }
</script>

<docs>
  # Examples

  This component renders a list of suggestions coming from the user queries history

  ## Default usage

  No props are required for the usage of this component.

  ```vue
  <HistoryQueries />
  ```

  ## Overriding Suggestion component

  The default `HistoryQuery` component that is used in every suggestion can be replaced.
  To do so, the `suggestion` slot is available, containing the history query data under the
  `suggestion` property. Remember that if HistoryQuery component wasn't used the
  `handleHistoryQuerySelection` method needs to be  implemented emitting the needed events.

  ```vue
  <HistoryQueries>
    <template #suggestion="{ suggestion }">
      <img class="x-history-query__icon" src="./history-query-extra-icon.svg" />
      <HistoryQuery :suggestion="suggestion" />
    </template>
  </HistoryQueries>
  ```

  ## Overriding suggestion-content and suggestion-delete-content slot

  The content of the `HistoryQuery` component can be overridden. For replacing the default
  suggestion content, the `suggestion-content` slot is available, containing the history query
  suggestion (in the `suggestion` property), and the highlighted HTML with the query (in the
  `suggestionQueryHighlighted` property).

  ```vue
  <HistoryQueries>
    <template #suggestion-content="{ suggestionQueryHighlighted }">
      <img src="./history-icon.svg"/>
      <span v-html="suggestionQueryHighlighted"></span>
    </template>
    <template #suggestion-delete-content>
      <img src="./delete-icon.svg"/>
    </template>
  </HistoryQueries>
  ```


</docs>
