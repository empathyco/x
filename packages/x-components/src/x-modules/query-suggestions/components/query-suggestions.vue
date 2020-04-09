<template>
  <Suggestions :suggestions="suggestions" class="x-query-suggestions">
    <template #default="{ suggestion }">
      <slot name="suggestion" :suggestion="suggestion">
        <QuerySuggestion :suggestion="suggestion">
          <template #default="{ suggestion }">
            <slot name="suggestionContent" :suggestion="suggestion" />
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

  This component renders a list of suggestions taken from the module's store state. It doesn't
  receive any prop.

  ```vue
  <QuerySuggestions />
  ```

  Overriding 'suggestion' slot
  ```vue
  <QuerySuggestions>
    <template #suggestion="{ suggestion }">
      <img class="x-query-suggestion__icon" src="https://bit.ly/2UVQiCJ" />
      <QuerySuggestion :suggestion="suggestion" />
    </template>
  </QuerySuggestions>
  ```

  Overriding 'suggestionContent' slot
  ```vue
  <QuerySuggestions>
    <template #suggestionContent="{ suggestion }">
      <img class="x-query-suggestion__icon" src="https://bit.ly/2UVQiCJ" />
      <span class="x-query-suggestion__query">
          {{ suggestion.query }}
        </span>
    </template>
  </QuerySuggestions>
  ```

  Overriding 'suggestion' and 'suggestionContent' slots
  ```vue
  <QuerySuggestions>
    <template #suggestion="{ suggestion }">
      <img class="x-query-suggestion__icon" src="https://bit.ly/2UVQiCJ" />
      <QuerySuggestion :suggestion="suggestion">
        <template #suggestionContent="{ suggestion }">
          <button class="x-query-suggestion__query">
            {{ suggestion.query }}
          </button>
        </template>
      </QuerySuggestion>
    </template>
  </QuerySuggestions>
  ```
</docs>
