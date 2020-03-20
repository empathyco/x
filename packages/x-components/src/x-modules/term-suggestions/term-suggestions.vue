<template>
  <ul v-if="suggestions.length">
    <li v-for="suggestion in suggestions" :key="suggestion.term">
      <!-- @slot An individual term suggestion, that should call the emitTermSuggestionSelected
      method when selected.
          @binding {Function} emitTermSuggestionSelected - A method that emits multiple events
          related to the selection of a term suggestion
          @binding {Suggestion} suggestion - A single term suggestion to be used by the component
      -->
      <slot name="term-suggestion" v-bind="{ suggestion, emitTermSuggestionSelected }">
        <button @click="emitTermSuggestionSelected(suggestion)" class="x-term-suggestion">
          {{ suggestion.term }}
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
  import { termSuggestionsXModule } from './x-module';

  /**
   * Simple term-suggestions component that renders a list of suggestions, allowing the user to
   * select one of them, and emitting the needed events.
   * A term suggestion is just a query that contains the user query, and that can have associated
   * a set of filters. I.e. If you are searching for `shirt`, a term suggestion could be
   * `long sleeve shirt`.
   *
   * @public
   */
  @Component({
    mixins: [xComponentMixin(termSuggestionsXModule)]
  })
  export default class TermSuggestions extends Vue {
    @State('termSuggestions', 'suggestions')
    public suggestions!: Suggestion[];

    /**
     * Emits a set of events related to the selection of a term suggestion.
     *
     * @param suggestion - The term suggestion that has been selected.
     * @public Can be used within the `term-suggestion` slot.
     */
    protected emitTermSuggestionSelected(suggestion: Suggestion): void {
      this.$x.emit('UserSelectedAQuery', suggestion.term);
      this.$x.emit('UserSelectedASuggestion', suggestion);
      this.$x.emit('UserSelectedATermSuggestion', suggestion);
    }
  }
</script>

<docs>
  #Examples

  ## Basic example

  You don't need to pass any props, or slots. Simply add the component, and when it has any term
  suggestions it will show them

  ```vue
  <TermSuggestions />
  ```

  ## Adding a custom term suggestion component

  You can use your custom implementation of a term suggestion component. To work correctly, it
  should use the `emitTermSuggestionSelected` function when the term suggestion is selected.
  In the example below, instead of using the default `button` tag for a term suggestion, an icon
  is added, and the text of the term suggestion is wrapped in a `span`

  ```vue
  <TermSuggestions>
    <template #term-suggestion="{suggestion, emitTermSuggestionSelected }">
      <button @click="emitTermSuggestionSelected(suggestion)" class="x-term-suggestion">
        <img src="./term-suggestion-icon.svg" class="x-term-suggestion__icon"/>
        <span class="x-term-suggestion__query">{{ suggestion.term }}</span>
      </button>
    </template>
  </TermSuggestions>
  ```
</docs>
