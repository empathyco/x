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
      <slot v-bind="{ suggestion, index, showFacets }" />
    </li>
  </component>
</template>

<style lang="scss" scoped>
  .x-suggestions {
    list-style-type: none;
  }
</style>

<script lang="ts">
  import { Component, Prop } from 'vue-property-decorator';
  import { Suggestion, Facet } from '@empathyco/x-types';
  import Vue from 'vue';
  import { isArrayEmpty } from '../../utils';

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
     * When showFacets is true, indicates if the query suggestion without facet must be rendered.
     *
     * @public
     */
    @Prop({ default: false })
    protected showQuery!: boolean;

    /**
     * An array with the unique keys for each suggestion. Required by the `v-for` loop.
     *
     * @returns An array with the unique keys of the suggestions.
     * @internal
     */
    protected get suggestionsKeys(): string[] {
      //TODO: Check if this method is needed
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

    /**
     * Slices the suggestions from the state.
     *
     * @returns - The list of suggestions slice by the number of items to render.
     *
     * @internal
     */
    protected get suggestionsToRender(): Suggestion[] {
      const suggestions = this.suggestions.slice(0, this.maxItemsToRender);
      let suggestionsToRender: Suggestion[] = [];
      suggestions.forEach(suggestion => {
        if (!this.showFacets || !suggestion.facets?.length) {
          suggestionsToRender.push({ ...suggestion, facets: [] });
        } else {
          const facetsSuggestions = this.generateSuggestionsFromFacets(suggestion);
          if (this.showQuery) {
            facetsSuggestions.push({
              ...suggestion,
              facets: []
            });
          }
          suggestionsToRender = [...suggestionsToRender, ...facetsSuggestions];
        }
      });
      return suggestionsToRender;
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
      const suggestions: Suggestion[] = [];
      suggestion.facets.forEach(facet => {
        facet.filters.forEach(filter => {
          const plannedSuggestion = { ...suggestion };
          const filterFacet = { ...facet };
          filterFacet.filters = [filter];
          plannedSuggestion.facets = [filterFacet];
          suggestions.push(plannedSuggestion);
        });
      });
      return suggestions;
    }
  }
</script>

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

In this example, the suggestions has been limited to render a maximum of 3 items.

_Type "puzzle" or another toy in the input field to try it out!_

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
