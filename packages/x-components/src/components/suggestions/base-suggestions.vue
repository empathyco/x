<template>
  <component :is="animation" v-if="suggestions.length" tag="ul" class="x-suggestions">
    <li
      v-for="(suggestion, index) in suggestionsToRender"
      :key="suggestionsKeys[index]"
      class="x-suggestions__item"
      :class="suggestionItemClass"
      data-test="suggestion-item"
    >
      <!--
        @slot (Required) List item content
            @binding {Suggestion} suggestion - Suggestion data
            @binding {number} index - Suggestion index
            @binding {Filter | undefined} filter - Suggestion's filter
       -->
      <slot v-bind="{ suggestion, index, filter: getSuggestionFilter(suggestion) }" />
    </li>
  </component>
</template>

<script lang="ts">
import type { Facet, Suggestion } from '@empathyco/x-types'
import type { PropType } from 'vue'
import { computed, defineComponent } from 'vue'
import { AnimationProp } from '../../types'
import { isArrayEmpty } from '../../utils/array'

/**
 * Paints a list of suggestions passed in by prop. Requires a component for a single suggestion
 * in the default slot for working.
 *
 * @public
 */
export default defineComponent({
  name: 'BaseSuggestions',
  props: {
    /**
     * The list of suggestions to render.
     *
     * @public
     */
    suggestions: {
      type: Array as PropType<Suggestion[]>,
      required: true,
    },
    /**
     * Animation component that will be used to animate the suggestion.
     *
     * @public
     */
    animation: {
      type: AnimationProp,
      default: 'ul',
    },
    /**
     * Number of suggestions to be rendered.
     *
     * @public
     */
    maxItemsToRender: Number,
    /**
     * Boolean value to indicate if the facets should be rendered.
     *
     * @public
     */
    showFacets: {
      type: Boolean,
      default: false,
    },
    /**
     * When `showFacets` property of `BaseSuggestions` component is true, it indicates if the suggestion without
     * filter should be rendered.
     *
     * @public
     */
    showPlainSuggestion: {
      type: Boolean,
      default: false,
    },
    /** Class inherited by content element. */
    suggestionItemClass: String,
  },
  setup(props) {
    /**
     * Creates a suggestion for each one of the filter inside each facet.
     *
     * @param suggestion - Suggestion to expand.
     * @returns A list of suggestions, each one with a single filter.
     *
     * @internal
     */
    const expandSuggestionFilters = (suggestion: Suggestion): Suggestion[] => {
      return (
        suggestion.facets?.flatMap(facet =>
          facet.filters.map(filter => ({
            ...suggestion,
            facets: [{ ...facet, filters: [filter] }],
          })),
        ) ?? []
      )
    }

    /**
     * Creates a list of suggestions to render based on the configuration of this component.
     *
     * @returns - The list of suggestions to be rendered by this component.
     *
     * @internal
     */
    const suggestionsToRender = computed(() =>
      props.suggestions
        .flatMap(suggestion =>
          props.showFacets && suggestion.facets?.length
            ? props.showPlainSuggestion
              ? [{ ...suggestion, facets: [] }, ...expandSuggestionFilters(suggestion)]
              : expandSuggestionFilters(suggestion)
            : { ...suggestion, facets: [] },
        )
        .slice(0, props.maxItemsToRender),
    )

    /**
     * Generates a string from the given facet.
     *
     * @param facet - The facet to reduce to a string.
     * @returns - A string representing the facet.
     * @internal
     */
    const getFacetKey = (facet: Facet) => facet.filters.map(filter => filter.id).join('&')

    /**
     * Generates a string from the given facets.
     *
     * @param facets - The list of facets to reduce to a string.
     * @returns - A string representing the list of facets.
     * @internal
     */
    const getFacetsKey = (facets: Facet[]) => facets.map(getFacetKey).join('&')

    /**
     * An array with the unique keys for each suggestion. Required by the `v-for` loop.
     *
     * @returns An array with the unique keys of the suggestions.
     * @internal
     */
    const suggestionsKeys = computed(() =>
      suggestionsToRender.value.map(suggestion =>
        isArrayEmpty(suggestion.facets)
          ? suggestion.query
          : `${suggestion.query}-in-${getFacetsKey(suggestion.facets)}`,
      ),
    )

    /**
     * Returns the filter contained by the suggestion.
     *
     * @param suggestion - Suggestion containing the filter.
     * @returns The suggestion filter.
     * @internal
     */
    const getSuggestionFilter = (suggestion: Suggestion) => suggestion.facets?.[0]?.filters[0]

    return { suggestionsToRender, suggestionsKeys, getSuggestionFilter }
  },
})
</script>

<style lang="css" scoped>
.x-suggestions {
  list-style-type: none;
}

.x-suggestions,
.x-suggestions__item {
  display: flex;
  flex-flow: column nowrap;
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
<template>
  <BaseSuggestions :suggestions="suggestions">
    <template #default="{ suggestion }">
      <button @click="emitSuggestionSelected($event, suggestion)">
        {{ suggestion.query }}
      </button>
    </template>
  </BaseSuggestions>
</template>

<script setup>
import { ref } from 'vue'
import { BaseSuggestions } from '@empathyco/x-components'
import { use$x } from '../../composables'

const x = use$x()
const suggestions = ref([
  {
    query: 'Chips',
    facets: [],
    key: 'chips',
    totalResults: 10,
    results: [],
    modelName: 'PopularSearch',
  },
  {
    query: 'Puzzle',
    facets: [],
    key: 'puzzle',
    totalResults: 5,
    results: [],
    modelName: 'PopularSearch',
  },
])
function emitSuggestionSelected(event, suggestion) {
  x.emit('UserAcceptedAQuery', suggestion.query, { target: event.target })
  x.emit('UserSelectedAQuerySuggestion', suggestion, { target: event.target })
}
</script>
```

### Play with props

In this example, the suggestions has been limited to render a maximum of 3 items. _Type "puzzle" or
another toy in the input field to try it out!_

```vue
<template>
  <BaseSuggestions :suggestions="suggestions" :maxItemsToRender="3" />
</template>

<script setup>
import { BaseSuggestions } from '@empathyco/x-components'
const suggestions = [
  {
    facets: [],
    key: 'chips',
    query: 'Chips',
    totalResults: 10,
    results: [],
    modelName: 'PopularSearch',
  },
  {
    facets: [],
    key: 'puzzle',
    query: 'Puzzle',
    totalResults: 5,
    results: [],
    modelName: 'PopularSearch',
  },
  {
    facets: [],
    key: 'lego',
    query: 'Lego',
    totalResults: 8,
    results: [],
    modelName: 'PopularSearch',
  },
  {
    facets: [],
    key: 'car',
    query: 'Car',
    totalResults: 3,
    results: [],
    modelName: 'PopularSearch',
  },
]
</script>
```

In this example, the filters of the suggestion will be rendered along with the query.

The `showPlainSuggestion` prop can be used to indicate if the suggestion without filter must be
rendered along with the suggestion with filters.

This will render:

- Chips //If `showPlainSuggestion` is true
- Chips EXAMPLE

```vue
<template>
  <BaseSuggestions :suggestions="suggestions" showFacets showPlainSuggestion />
</template>

<script setup>
import { BaseSuggestions } from '@empathyco/x-components'
const suggestions = [
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
            modelName: 'SimpleFilter',
          },
        ],
      },
    ],
    key: 'chips',
    query: 'Chips',
    totalResults: 10,
    results: [],
    modelName: 'PopularSearch',
  },
]
</script>
```

In this example, the `suggestionItemClass` prop can be used to add classes to the suggestion item.

```vue
<template>
  <BaseSuggestions :suggestions="suggestions" suggestionItemClass="x-custom-class" />
</template>

<script setup>
import { BaseSuggestions } from '@empathyco/x-components'
const suggestions = [
  {
    facets: [],
    key: 'chips',
    query: 'Chips',
    totalResults: 10,
    results: [],
    modelName: 'PopularSearch',
  },
]
</script>
```
</docs>
