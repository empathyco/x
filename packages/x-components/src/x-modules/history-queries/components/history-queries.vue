<template>
  <BaseSuggestions
    :suggestions="historyQueries"
    class="x-history-queries"
    data-test="history-queries"
    :animation="animation"
  >
    <template #default="{ suggestion, index }">
      <!--
        @slot History Query item
            @binding {Suggestion} suggestion - History Query suggestion data
            @binding {number} index - History Query suggestion index
      -->
      <slot name="suggestion" v-bind="{ suggestion, index }">
        <HistoryQuery
          :suggestion="suggestion"
          data-test="history-query-item"
          class="x-history-queries__item"
        >
          <template #default="{ queryHTML }">
            <!-- eslint-disable max-len -->
            <!--
              @slot History Query content
                  @binding {Suggestion} suggestion - History Query suggestion data
                  @binding {string} queryHTML - Suggestion's query with the matching part inside a span tag
                  @binding {number} index - History Query suggestion index
            -->
            <!-- eslint-enable max-len -->
            <slot name="suggestion-content" v-bind="{ suggestion, index, queryHTML }" />
          </template>
          <template #remove-button-content>
            <!--
              @slot History Query remove button content
                  @binding {Suggestion} suggestion - History Query suggestion data
                  @binding {number} index - History Query suggestion index
            -->
            <slot name="suggestion-remove-content" v-bind="{ suggestion, index }" />
          </template>
        </HistoryQuery>
      </slot>
    </template>
  </BaseSuggestions>
</template>

<script lang="ts">
  import { HistoryQuery as HistoryQueryModel } from '@empathy/search-types';
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import BaseSuggestions from '../../../components/base-suggestions.vue';
  import { Getter } from '../../../components/decorators';
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
    components: { BaseSuggestions, HistoryQuery },
    mixins: [xComponentMixin(historyQueriesXModule)]
  })
  export default class HistoryQueries extends Vue {
    /**
     * Animation component that will be used to animate the suggestions.
     *
     * @public
     */
    @Prop()
    protected animation!: Vue;

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
  <HistoryQueries/>
  ```

  ## Overriding Suggestion component

  The default `HistoryQuery` component that is used in every suggestion can be replaced.
  To do so, the `suggestion` slot is available, containing the history query data under the
  `suggestion` property. Remember that if HistoryQuery component wasn't used the
  `handleHistoryQuerySelection` method needs to be implemented emitting the needed events.

  ```vue
  <HistoryQueries>
    <template #suggestion="{ suggestion }">
      <img class="x-history-query__icon" src="./history-query-extra-icon.svg"/>
      <HistoryQuery :suggestion="suggestion"/>
    </template>
  </HistoryQueries>
  ```

  ## Overriding suggestion-content and suggestion-remove-content slot

  The content of the `HistoryQuery` component can be overridden. For replacing the default
  suggestion content, the `suggestion-content` slot is available, containing the history query
  suggestion (in the `suggestion` property), and the matching query part HTML (in the
  `queryHTML` property).

  ```vue
  <HistoryQueries>
    <template #suggestion-content="{ queryHTML }">
      <img class="x-history-query__history-icon" src="./history-icon.svg"/>
      <span class="x-history-query__matching-part" v-html="queryHTML"></span>
    </template>
    <template #suggestion-remove-content>
      <img class="x-history-queries__remove" src="./remove-icon.svg"/>
    </template>
  </HistoryQueries>
  ```

</docs>
