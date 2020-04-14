<template>
  <ul v-if="suggestions.length" class="x-suggestions">
    <li
      v-for="(suggestion, index) in suggestions"
      :key="suggestionsKeys[index]"
      class="x-suggestions__item"
      data-test="suggestion-item"
    >
      <!-- @slot (Required) Slot for an individual suggestion, responsible for handling its
      selection by emitting the appropriate event -->
      <!-- @binding {Suggestion} suggestion - The data of the suggestion-->
      <slot :suggestion="suggestion" />
    </li>
  </ul>
</template>

<script lang="ts">
  import { Component, Prop } from 'vue-property-decorator';
  import { Suggestion, Facet } from '@empathy/search-types';
  import Vue from 'vue';
  import { isArrayEmpty } from '../../utils/array';

  /**
   * Paints a list of suggestions passed in by prop. Requires a component for a single suggestion
   * in the default slot for working.
   *
   * @public
   */
  @Component
  export default class Suggestions extends Vue {
    /**
     * The list of suggestions to render.
     *
     * @public
     */
    @Prop({ required: true })
    protected suggestions!: Suggestion[];

    /**
     * An array with the unique keys for each suggestion. Required by the `v-for` loop.
     *
     * @returns An array with the unique keys of the suggestions.
     * @internal
     */
    protected get suggestionsKeys(): string[] {
      return this.suggestions.map(suggestion =>
        isArrayEmpty(suggestion.facets)
          ? suggestion.query
          : `${suggestion.query}-in-${this.getFacetsKey(suggestion.facets)}`
      );
    }

    /**
     * Generates a string from the given facets.
     *
     * @param facets - The list of facets to reduce to a string.
     * @returns - A string representing the list of facets.
     * @internal
     */
    protected getFacetsKey(facets: Facet[]): string {
      // Component methods are bound by Vue:
      // eslint-disable-next-line @typescript-eslint/unbound-method
      return facets.map(this.getFacetKey).join('&');
    }

    /**
     * Generates a string from the given facet.
     *
     * @param facet - The facet to reduce to a string.
     * @returns - A string representing the facet.
     * @internal
     */
    protected getFacetKey(facet: Facet): string {
      return facet.filters.map(filter => filter.id).join('&');
    }
  }
</script>

<docs>
  #Example

  For this component to work, you will need to set a list of suggestions as prop, and also to
  implement the component for single suggestion, which handles the click event. In the following
  example, the suggestions are retrieved from a property called `suggestions`, and the
  implementation of the suggestion component is a simple `button`, that calls the
  `emitSuggestionSelected` method when clicked.

  ```vue
  <Suggestions :suggestions="suggestions">
    <template #default="{ suggestion }">
      <button @click="emitSuggestionSelected($event, suggestion)">
        {{ suggestion.query }}
      </button>
    </template>
  </Suggestions>
  ```

  Following the previous example, the component options object could be something like this:

  ```js
    export default {
      computed: {
        ...mapGetters(['x', 'querySuggestions'], { suggestions: 'suggestions' })
      },
      methods: {
        emitSuggestionSelected(event, suggestion) {
          this.$x.emit('UserAcceptedAQuery', suggestion.query, { target: event.target });
          this.$x.emit('UserSelectedAQuerySuggestion', suggestion, { target: event.target });
        }
      }
    }
  ```

  It retrieves the suggestions from a `suggestions` property in the Vuex store `x/querySuggestions`
  module, and implements a `emitSuggestionSelected` method that emits two events to the `$x` bus.
</docs>
