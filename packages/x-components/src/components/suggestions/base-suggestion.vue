<template>
  <button ref="el" :class="dynamicCSSClasses" @click="emitEvents">
    <!--
      @slot Button content
          @binding {Suggestion} suggestion - Suggestion data
          @binding {String} query - The query that the suggestion belongs to
          @binding {Filter} filter - Suggestion's filter
      -->
    <slot v-bind="{ query, suggestion, filter }">
      <Highlight class="x-suggestion__query" :text="suggestion.query" :highlight="query" />
      <span v-if="filter" class="x-suggestion__filter">{{ filter.label }}</span>
    </slot>
  </button>
</template>

<script lang="ts">
import type { BooleanFilter, Suggestion } from '@empathyco/x-types'
import type { PropType } from 'vue'
import type { QueryFeature } from '../../types'
import type { VueCSSClasses } from '../../utils/types'
import type { XEventsTypes } from '../../wiring/events.types'
import { forEach } from '@empathyco/x-utils'
import { computed, defineComponent, ref } from 'vue'
import { use$x } from '../../composables/index'
import Highlight from '../highlight.vue'

/**
 * Renders a button with a default slot. It receives a query, which should be the query of the
 * module using this component, a suggestion, the {@link XEvent} that will be emitted
 * on click with a given feature.
 *
 * The default slot receives the suggestion and the matched query has props.
 *
 * @public
 */
export default defineComponent({
  components: { Highlight },
  props: {
    /**
     * The normalized query of the module using this component.
     *
     * @public
     */
    query: {
      type: String,
      default: '',
    },

    /**
     * The suggestion to render and use in the default slot.
     *
     * @public
     */
    suggestion: {
      type: Object as PropType<Suggestion>,
      required: true,
    },

    /**
     * The feature from which the events will be emitted.
     *
     * @public
     */
    //TODO: set to true when the suggestions components pass it.
    feature: {
      type: String as PropType<QueryFeature>,
    },

    /**
     * The {@link XEvent} that will be emitted when selecting a suggestion.
     *
     * @public
     */
    suggestionSelectedEvents: {
      type: Object as PropType<Partial<XEventsTypes>>,
      required: true,
    },

    /**
     * Indicates if the curated suggestion should be highlighted.
     *
     * @public
     */
    highlightCurated: {
      type: Boolean,
    },
  },

  setup(props) {
    const el = ref<HTMLElement | null>(null)

    const $x = use$x()

    /**
     * Returns the suggestion filter object.
     * It is a BooleanFilter because the label is needed.
     * It returns only the first element because the facets and filters are being planned
     * in the BaseSuggestions component.
     *
     * @returns The filter.
     * @public
     */
    const filter = computed<BooleanFilter | undefined>(
      () => props.suggestion.facets?.[0]?.filters[0] as BooleanFilter,
    )

    /**
     * The event handler that will be triggered when clicking on a suggestion.
     *
     * @remarks
     * UserAcceptedAQuery: suggestion.query
     * UserSelectedASuggestion: suggestion
     * UserClickedAFilter: suggestion.facets[0].filters[0]
     * Merges the events defined in the suggestionSelectedEvents prop and also emits them
     *
     * @returns The {@link XEvent} to emit.
     * @public
     */
    const events = computed<Partial<XEventsTypes>>(() => {
      const filterEvent: Partial<XEventsTypes> = filter.value
        ? { UserClickedAFilter: filter.value }
        : {}
      return {
        UserAcceptedAQuery: props.suggestion.query,
        UserSelectedASuggestion: props.suggestion,
        ...props.suggestionSelectedEvents,
        ...filterEvent,
      }
    })

    /**
     * Emits the events when the button is clicked.
     *
     * @public
     */
    const emitEvents = (): void => {
      forEach(events.value, (event, payload): void => {
        $x.emit(event, payload, {
          target: el.value!,
          feature: props.feature,
        })
      })
    }

    /**
     * Checks if the suggestion is curated and if it should be highlighted.
     *
     * @returns True if the suggestion is curated and should be highlighted.
     *
     * @internal
     */
    const shouldHighlightCurated = computed<boolean>(
      () => props.highlightCurated && !!props.suggestion.isCurated,
    )

    /**
     * Generates css classes dynamically.
     *
     * @remarks
     * 'x-suggestion--matching added when the query should be matched.
     *
     * @returns The {@link VueCSSClasses} classes.
     * @public
     */
    const dynamicCSSClasses = computed<VueCSSClasses>(() => ({
      'x-suggestion--is-curated': shouldHighlightCurated.value,
    }))

    return {
      el,
      filter,
      emitEvents,
      dynamicCSSClasses,
    }
  },
})
</script>

<docs lang="mdx">
## Events

This component emits the following events:

- [`UserAcceptedAQuery`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts):
  the event is emitted after the user clicks the button. The event payload is the suggestion query
  data.
- [`UserSelectedASuggestion`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts):
  the event is emitted after the user clicks the button. The event payload is the suggestion data.
- [`UserClickedAFilter`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts):
  the event is emitted after the user clicks the button if the suggestion includes a filter. The
  event payload is the suggestion filter.
- The component can emit more events on click using the `suggestionSelectedEvents` prop.

## Examples

### Basic usage

This suggestion component expects a suggestion to render and pass to its default slot, a normalized
query to compare with the suggestion's query and highlight its matching parts, and events to emit
when the suggestion is selected.

If the suggestion contains a filter, it is displayed next to the suggestion.

```vue live
<template>
  <BaseSuggestion :query="query" :suggestion="suggestion" />
</template>

<script setup>
import { BaseSuggestion } from '@empathyco/x-components'
const query = 'st'
const suggestion = {
  modelName: 'QuerySuggestion',
  query: 'steak',
  facets: [
    {
      modelName: 'SimpleFacet',
      id: 'category',
      label: 'Category',
      filters: [
        {
          id: 'category:groceries',
          modelName: 'SimpleFilter',
          facetId: 'category-facet',
          label: 'Groceries',
          selected: false,
          totalResults: 10,
        },
      ],
    },
  ],
}
</script>
```

### Customise the content

You can make this component render any content you want by using the `default` slot.

```vue live
<template>
  <BaseSuggestion :query="query" :suggestion="suggestion">
    <template #default="{ suggestion, query, filter }">
      <span>🔍</span>
      <Highlight :text="suggestion.query" :highlight="query" />
      <span v-if="filter">{{ filter.label }}</span>
    </template>
  </BaseSuggestion>
</template>

<script setup>
import { BaseSuggestion } from '@empathyco/x-components'
const query = 'st'
const suggestion = {
  modelName: 'QuerySuggestion',
  query: 'steak',
}
</script>
```

### Emitting custom events with suggestionSelectedEvents

You can emit additional custom events when a suggestion is selected by passing them in the `suggestionSelectedEvents` prop. For example, to emit a custom event called `CustomSuggestionEvent` with a payload:

```vue live
<template>
  <BaseSuggestion
    :query="query"
    :suggestion="suggestion"
    :suggestionSelectedEvents="suggestionSelectedEvents"
  />
</template>

<script setup>
import { BaseSuggestion } from '@empathyco/x-components'
const query = 'st'
const suggestion = {
  modelName: 'QuerySuggestion',
  query: 'steak',
}
const suggestionSelectedEvents = {
  CustomSuggestionEvent: { custom: 'payload' },
}
</script>
```
</docs>
