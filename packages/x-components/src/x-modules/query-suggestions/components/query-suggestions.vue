<template>
  <BaseSuggestions
    :suggestions="suggestions"
    class="x-query-suggestions"
    data-test="query-suggestions"
  >
    <template #default="{ suggestion }">
      <!-- @slot Slot for an individual Query Suggestion item. -->
      <!-- @binding {Suggestion} suggestion - The data of the query suggestion. -->
      <slot name="suggestion" :suggestion="suggestion">
        <QuerySuggestion :suggestion="suggestion" class="x-query-suggestions__suggestion">
          <template #default="{ suggestion, queryHTML }">
            <!-- @slot Slot for the Query Suggestion's content. -->
            <!-- @binding {Suggestion} suggestion - The data of the query suggestion. -->
            <!-- @binding {string} queryHTML - The suggestion's query with the matching part inside
            a <span> tag -->
            <slot name="suggestion-content" v-bind="{ suggestion, queryHTML }" />
          </template>
        </QuerySuggestion>
      </slot>
    </template>
  </BaseSuggestions>
</template>

<script lang="ts">
  import { Suggestion } from '@empathy/search-types';
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import BaseSuggestions from '../../../components/base-suggestions.vue';
  import { State } from '../../../components/decorators';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { querySuggestionsXModule } from '../x-module';
  import QuerySuggestion from './query-suggestion.vue';

  /**
   * Simple query-suggestions component that renders a list of query suggestions.
   *
   * @remarks
   * A query suggestion is just a query that contains the user query, and that can have associated
   * a set of filters. I.e. If you are searching for `shirt`, a query suggestion could be
   * `long sleeve shirt`.
   *
   * @public
   */
  @Component({
    components: { BaseSuggestions, QuerySuggestion },
    mixins: [xComponentMixin(querySuggestionsXModule)]
  })
  export default class QuerySuggestions extends Vue {
    /**
     * The module's list of suggestions.
     *
     * @public
     */
    @State('querySuggestions', 'suggestions')
    public suggestions!: Suggestion[];
  }
</script>

<docs>
  #Example

  This component renders a list of suggestions taken from the module's store state.

  ## Default Usage

  No props are required for the usage of this component.

  ```vue
  <QuerySuggestions/>
  ```

  ## Overriding Query Suggestion slot

  The default `QuerySuggestion` component that is used in every suggestion can be replaced.
  To do so, the `suggestion` slot is available, containing the query suggestion data under the
  `suggestion` property. Remember that if QuerySuggestion component isn't used, the
  `handleQuerySuggestionSelection` method needs to be implemented emitting the needed events.

  ```vue
  <QuerySuggestions>
    <template #suggestion="{ suggestion }">
      <img class="x-query-suggestion__icon" src="./query-suggestion-extra-icon.svg"/>
      <QuerySuggestion :suggestion="suggestion"/>
    </template>
  </QuerySuggestions>
  ```

  ## Overriding Query Suggestion's content slot

  The content of the `QuerySuggestion` component can be overridden. For replacing the default
  suggestion content, the `suggestion-content` slot is available, containing the query suggestion
  data (in the `suggestion` property), and the matching query part HTML (in the
  `queryHTML` property).

  ```vue
  <QuerySuggestions>
    <template #suggestion-content="{ suggestion, queryHTML }">
      <img class="x-query-suggestion__icon" src="./query-suggestion-icon.svg"/>
      <span
        :aria-label="`Select ${suggestion.query}`"
        class="x-query-suggestion__query"
        v-html="queryHTML"
      />
    </template>
  </QuerySuggestions>
  ```
</docs>
