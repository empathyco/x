<template>
  <ul v-if="suggestions.length">
    <li v-for="suggestion in suggestions" :key="suggestion.query">
      <!-- @slot A query suggestion item.
          @binding {Suggestion} suggestion - The suggestion data.
      -->
      <slot name="query-suggestion" :suggestion="suggestion">
        <QuerySuggestion :suggestion="suggestion" />
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
  import QuerySuggestion from './components/query-suggestion.vue';
  import { querySuggestionsXModule } from './x-module';

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
    components: { QuerySuggestion },
    mixins: [xComponentMixin(querySuggestionsXModule)]
  })
  export default class QuerySuggestions extends Vue {
    @State('querySuggestions', 'suggestions')
    public suggestions!: Suggestion[];
  }
</script>

<docs>
  #Examples

  ## Basic example

  You don't need to pass any props, or slots. Simply add the component, and when it has any query
  suggestions it will show them.

  ```vue
  <QuerySuggestions/>
  ```

  ## Adding a custom query suggestion component

  You can use your custom implementation of a query suggestion component. To work correctly, you
  need to bind the query and the suggestion to the query-suggestion slot. You should also remember
  to add a function to handle when a query suggestion is selected (e.g.
  `emitQuerySuggestionSelected`).

  In the example below, instead of using the default `button` tag for a query suggestion, we're
  adding an icon and wrapping the text of the query suggestion in a <span/>.

  ```vue
  <QuerySuggestions>
    <template #query-suggestion="{ suggestion }">
      <button @click="emitQuerySuggestionSelected(suggestion)" class="x-query-suggestion">
        <img src="./query-suggestion-icon.svg" class="x-query-suggestion__icon"/>
        <span class="x-query-suggestion__query">{{ suggestion.query }}</span>
      </button>
    </template>
  </QuerySuggestions>
  ```
</docs>
