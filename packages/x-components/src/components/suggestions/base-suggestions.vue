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
            @binding {Filter} filter - Suggestion's filter
       -->
      <slot v-bind="{ suggestion, index, filter: getSuggestionFilter(suggestion) }" />
    </li>
  </component>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { Suggestion, Facet, Filter } from '@empathyco/x-types';
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
     * Boolean value to indicate if the facets should be rendered.
     *
     * @public
     */
    @Prop({ default: false, type: Boolean })
    protected showFacets!: boolean;

    /**
     * When {@link showFacets} is true, it indicates if the suggestion without filter
     * should be rendered.
     *
     * @public
     */
    @Prop({ default: false, type: Boolean })
    protected showPlainSuggestion!: boolean;

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
     * Creates a list of suggestions to render based on the configuration of this component.
     *
     * @returns - The list of suggestions to be rendered by this component.
     *
     * @internal
     */ protected get suggestionsToRender(): Suggestion[] {
      return this.suggestions
        .flatMap(suggestion =>
          this.showFacets && suggestion.facets.length
            ? this.showPlainSuggestion
              ? [{ ...suggestion, facets: [] }, ...this.expandSuggestionFilters(suggestion)]
              : this.expandSuggestionFilters(suggestion)
            : { ...suggestion, facets: [] }
        )
        .slice(0, this.maxItemsToRender);
    }

    /**
     * Creates a suggestion for each one of the filter inside each facet.
     *
     * @param suggestion - Suggestion to expand.
     * @returns A list of suggestions, each one with a single filter.
     *
     * @internal
     */
    protected expandSuggestionFilters(suggestion: Suggestion): Suggestion[] {
      return suggestion.facets.flatMap(facet =>
        facet.filters.map(filter => ({ ...suggestion, facets: [{ ...facet, filters: [filter] }] }))
      );
    }

    /**
     * Returns the filter contained by the suggestion.
     *
     * @param suggestion - Suggestion containing the filter.
     * @returns The suggestion filter.
     * @internal
     */
    protected getSuggestionFilter(suggestion: Suggestion): Filter {
      return suggestion.facets[0]?.filters[0];
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

In this example, the filters of the suggestion will be rendered along with the query.

The `appendSuggestionWithoutFilter` prop can be used to indicate if the suggestion without filter
must be rendered along with the suggestion with filters.

This will render:

- Chips //If `appendSuggestionWithoutFilter` is true
- Chips EXAMPLE

```vue
<template>
  <BaseSuggestions :suggestions="suggestions" showFacets appendSuggestionWithoutFilter />
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
            facets: [
              {
                id: 'exampleFacet',
                label: 'exampleFacet',
                modelName: 'SimpleFacet',
                filters: [
                  {
                    facetId: 'exampleFacet',
                    id: '{!tag=exampleFacet}exampleFacet_60361120_64009600:"EXAMPLE"',
                    label: 'EXAMPLE',
                    selected: false,
                    totalResults: 10,
                    modelName: 'SimpleFilter'
                  }
                ]
              }
            ],
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
