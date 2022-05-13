<template>
  <component :is="animation" v-if="suggestions.length" tag="ul" class="x-list x-suggestions">
    <li
      v-for="(suggestion, index) in suggestionsToRender"
      :key="suggestionsKeys[index]"
      class="x-list x-suggestions__item"
      data-test="suggestion-item"
    >
      <!--
        @slot (Required) List item content
            @binding {Suggestion} suggestion - Suggestion data
            @binding {number} index - Suggestion index
       -->
      <slot v-bind="{ suggestion, index }" />
    </li>
  </component>
</template>

<script lang="ts">
  import { Component, Prop } from 'vue-property-decorator';
  import { Suggestion, Facet } from '@empathyco/x-types';
  import Vue from 'vue';
  import { isArrayEmpty } from '../../utils/array';

  /**
   * Paints a list of suggestions passed in by prop. Requires a component for a single suggestion
   * in the default slot for working.
   *
   * @public
   */
  @Component
  export default class BaseSuggestions extends Vue {
    /**
     * The list of suggestions to render.
     *
     * @public
     */
    @Prop({ required: true })
    protected suggestions!: Suggestion[];

    /**
     * Animation component that will be used to animate the suggestion.
     *
     * @public
     */
    @Prop({ default: 'ul' })
    protected animation!: Vue | string;

    /**
     * Number of suggestions to be rendered.
     *
     * @public
     */
    @Prop()
    protected maxItemsToRender?: number;

    /**
     * Indicates if the suggestions must be rendered along with its facets.
     *
     * @public
     */
    @Prop({ default: true })
    protected showFacets!: boolean;

    /**
     * When showFacets is true, indicates if the suggestion without filter
     * must be appended to the list.
     *
     * @public
     */
    @Prop({ default: false })
    protected appendSuggestionWithoutFilter!: boolean;

    /**
     * An array with the unique keys for each suggestion. Required by the `v-for` loop.
     *
     * @returns An array with the unique keys of the suggestions.
     * @internal
     */
    protected get suggestionsKeys(): string[] {
      return this.suggestionsToRender.map(suggestion =>
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

    /**
     * Slices the suggestions from the state.
     *
     * @returns - The list of suggestions slice by the number of items to render.
     *
     * @internal
     */
    protected get suggestionsToRender(): Suggestion[] {
      const suggestions = this.suggestions.slice(0, this.maxItemsToRender);
      return this.showFacets
        ? this.mapSuggestionsWithFacets(suggestions)
        : this.mapSuggestionsWithoutFacets(suggestions);
    }

    /**
     * Returns the suggestions with only one facet and filter per item.
     * If a suggestion has more than one facet/filter, it will return an instance
     * for each one of the facets/filters.
     *
     * @param suggestions - Suggestions.
     *
     * @returns - The mapped suggestions with a facet and filter per item.
     * @internal
     */
    protected mapSuggestionsWithFacets(suggestions: Suggestion[]): Suggestion[] {
      return suggestions.reduce<Suggestion[]>(
        (acc, suggestion) => [...acc, ...this.generateSuggestionsFromFacets(suggestion)],
        []
      );
    }

    /**
     * Returns the suggestions with the facets array empty.
     *
     * @param suggestions - Suggestions.
     *
     * @returns - The suggestions with the facets array empty.
     * @internal
     */
    protected mapSuggestionsWithoutFacets(suggestions: Suggestion[]): Suggestion[] {
      return suggestions.map(suggestion => ({ ...suggestion, facets: [] }));
    }

    /**
     * Generates a copy of the original suggestion per facet and filter.
     *
     * @param suggestion - Suggestion with the facets.
     *
     * @returns - A list of suggestions, each one containing one facet and one filter.
     * @internal
     */
    protected generateSuggestionsFromFacets(suggestion: Suggestion): Suggestion[] {
      if (!suggestion.facets || !suggestion.facets.length) {
        return [{ ...suggestion, facets: [] }];
      }
      const suggestionsWithFacets = suggestion.facets.reduce<Suggestion[]>((suggestions, facet) => {
        facet.filters.forEach(filter => {
          suggestions.push({
            ...suggestion,
            facets: [
              {
                ...facet,
                filters: [filter]
              }
            ]
          });
        });
        return suggestions;
      }, []);
      if (this.appendSuggestionWithoutFilter) {
        suggestionsWithFacets.unshift({ ...suggestion, facets: [] });
      }
      return suggestionsWithFacets;
    }
  }
</script>

<style lang="scss" scoped>
  .x-suggestions {
    list-style-type: none;
  }
</style>

<docs lang="mdx">
## Examples

For this component to work, you will need to set a list of suggestions as prop, and also to
implement the component for single suggestion, which handles the click event. In the following
example, the suggestions are retrieved from a property called `suggestions`, and the implementation
of the suggestion component is a simple `button`, that calls the `emitSuggestionSelected` method
when clicked.

```vue
<BaseSuggestions :suggestions="suggestions">
  <template #default="{ suggestion }">
    <button @click="emitSuggestionSelected($event, suggestion)">
      {{ suggestion.query }}
    </button>
  </template>
</BaseSuggestions>
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
};
```

### Play with props

In this example, the suggestions has been limited to render a maximum of 3 items. _Type "puzzle" or
another toy in the input field to try it out!_

```vue
<template>
  <BaseSuggestions :suggestions="suggestions" :maxItemToRender="3" />
</template>

<script>
  import { BaseSuggestions } from '@empathyco/x-components';

  export default {
    name: 'BaseSuggestionsDemo',
    components: {
      BaseSuggestions
    },
    data() {
      return {
        suggestions: [
          {
            facets: [],
            key: 'chips',
            query: 'Chips',
            totalResults: 10,
            results: [],
            modelName: 'PopularSearch'
          }
        ]
      };
    }
  };
</script>
```
</docs>
