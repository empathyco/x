<template>
  <Suggestions :suggestions="suggestions" class="x-query-suggestions" data-test="query-suggestions">
    <template #default="{ suggestion }">
      <!-- @slot Slot for an individual Query Suggestion item. -->
      <!-- @binding {Suggestion} suggestion - The data of the query suggestion. -->
      <slot name="suggestion" :suggestion="suggestion">
        <QuerySuggestion :suggestion="suggestion" class="x-query-suggestions__query-suggestion">
          <template #default="{ suggestion, suggestionQueryHighlighted }">
            <!-- @slot Slot for the Query Suggestion's content. -->
            <!-- @binding {Suggestion} suggestion - The data of the query suggestion. -->
            <!-- @binding {string} suggestionQueryHighlighted - The suggestion query highlighting
             the matching parts against the module's query. -->
            <slot name="suggestion-content" v-bind="{ suggestion, suggestionQueryHighlighted }" />
          </template>
        </QuerySuggestion>
      </slot>
    </template>
  </Suggestions>
</template>

<script lang="ts">
  import { Suggestion } from '@empathy/search-types';
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import { State } from '../../../components/decorators';
  import Suggestions from '../../../components/pure/suggestions.vue';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import QuerySuggestion from './query-suggestion.vue';
  import { querySuggestionsXModule } from '../x-module';

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
    components: { Suggestions, QuerySuggestion },
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
  <QuerySuggestions />
  ```

  ## Overriding Query Suggestion slot

  The default `QuerySuggestion` component that is used in every suggestion can be replaced.
  To do so, the `suggestion` slot is available, containing the query suggestion data under the
  `suggestion` property. Remember that if QuerySuggestion component isn't used, the
  `handleQuerySuggestionSelection` method needs to be  implemented emitting the needed events.

  ```vue
  <QuerySuggestions>
    <template #suggestion="{ suggestion }">
      <img class="x-query-suggestion__icon" src="./query-suggestion-extra-icon.svg" />
      <QuerySuggestion :suggestion="suggestion" />
    </template>
  </QuerySuggestions>
  ```

  ## Overriding Query Suggestion's content slot

  The content of the `QuerySuggestion` component can be overridden. For replacing the default
  suggestion content, the `suggestion-content` slot is available, containing the query suggestion
  data (in the `suggestion` property), and the highlighted HTML with the query (in the
  `suggestionQueryHighlighted` property).

  ```vue
  <QuerySuggestions>
    <template #suggestion-content="{ suggestion, suggestionQueryHighlighted }">
      <img class="x-query-suggestion__icon" src="./query-suggestion-icon.svg" />
      <span
        :aria-label="`Select ${suggestion.query}`"
        class="x-query-suggestion__query"
        v-html="suggestionQueryHighlighted"
      />
    </template>
  </QuerySuggestions>
  ```
</docs>
