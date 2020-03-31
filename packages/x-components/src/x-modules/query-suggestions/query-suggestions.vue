<template>
  <ul v-if="suggestions.length">
    <li v-for="suggestion in suggestions" :key="suggestion.query">
      <!-- @slot An individual query suggestion, that should call the emitQuerySuggestionSelected
      method when selected.
          @binding {Function} emitQuerySuggestionSelected - A method that emits multiple events
          related to the selection of a query suggestion
          @binding {Suggestion} suggestion - A single query suggestion to be used by the component
      -->
      <slot name="query-suggestion" v-bind="{ suggestion, emitQuerySuggestionSelected }">
        <button @click="emitQuerySuggestionSelected(suggestion)" class="x-query-suggestion">
          {{ suggestion.query }}
        </button>
      </slot>
    </li>
  </ul>
</template>

<script lang="ts">
  import { Suggestion } from '@empathy/search-types';
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import { State } from '../../components/decorators';
  import { xComponentMixin } from '../../components/x-component.mixin';
  import { querySuggestionsXModule } from './x-module';

  /**
   * Simple query-suggestions component that renders a list of suggestions, allowing the user to
   * select one of them, and emitting the needed events.
   *
   * @remarks
   * A query suggestion is just a query that contains the user query, and that can have associated
   * a set of filters. I.e. If you are searching for `shirt`, a query suggestion could be
   * `long sleeve shirt`.
   *
   * @public
   */
  @Component({
    mixins: [xComponentMixin(querySuggestionsXModule)]
  })
  export default class QuerySuggestions extends Vue {
    @State('querySuggestions', 'suggestions')
    public suggestions!: Suggestion[];

    /**
     * Emits a set of events related to the selection of a query suggestion.
     *
     * @param suggestion - The query suggestion that has been selected.
     * @public Can be used within the `query-suggestion` slot.
     */
    protected emitQuerySuggestionSelected(suggestion: Suggestion): void {
      this.$x.emit('UserAcceptedAQuery', suggestion.query);
      this.$x.emit('UserSelectedASuggestion', suggestion);
      this.$x.emit('UserSelectedAQuerySuggestion', suggestion);
    }
  }
</script>

<docs>
  #Examples

  ## Basic example

  You don't need to pass any props, or slots. Simply add the component, and when it has any query
  suggestions it will show them

  ```vue
  <QuerySuggestions />
  ```

  ## Adding a custom query suggestion component

  You can use your custom implementation of a query suggestion component. To work correctly, it
  should use the `emitQuerySuggestionSelected` function when the query suggestion is selected.
  In the example below, instead of using the default `button` tag for a query suggestion, an icon
  is added, and the text of the query suggestion is wrapped in a `span`

  ```vue
  <QuerySuggestions>
    <template #query-suggestion="{suggestion, emitQuerySuggestionSelected }">
      <button @click="emitQuerySuggestionSelected(suggestion)" class="x-query-suggestion">
        <img src="./query-suggestion-icon.svg" class="x-query-suggestion__icon"/>
        <span class="x-query-suggestion__query">{{ suggestion.query }}</span>
      </button>
    </template>
  </QuerySuggestions>
  ```
</docs>
