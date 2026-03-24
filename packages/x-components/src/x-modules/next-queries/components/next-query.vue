<template>
  <BaseSuggestion
    v-slot="baseScope"
    class="x-next-query"
    :suggestion="suggestion"
    :suggestion-selected-events="events"
    data-test="next-query"
    feature="next_query"
    :class="{ 'x-next-query--is-curated': shouldHighlightCurated }"
  >
    <!-- eslint-disable max-len -->
    <!--
        @slot Next Query content
            @binding {Object} v-bind - `BaseSuggestion` default slot scope: **suggestion** <code>Suggestion</code> - Suggestion data<br /> **query** <code>string</code> - The query that the suggestion belongs to<br /> **filter** <code>Filter \| undefined</code> - Suggestion's filter
            @binding {boolean} shouldHighlightCurated - True if the curated NQ should be highlighted
    -->
    <!-- eslint-enable max-len -->
    <slot v-bind="{ ...baseScope, shouldHighlightCurated }" />
  </BaseSuggestion>
</template>

<script lang="ts">
import type { NextQuery as NextQueryModel } from '@empathyco/x-types'
import type { PropType } from 'vue'
import type { XEventsTypes } from '../../../wiring/events.types'
import { computed, defineComponent } from 'vue'
import BaseSuggestion from '../../../components/suggestions/base-suggestion.vue'
import { nextQueriesXModule } from '../x-module'

/**
 * Renders a next query item which receives the suggestion that will be rendered as a prop. It
 * exposes a default slot to change the next query content. If the slot is not overridden,
 * it will render the suggestion query by default.
 *
 * @public
 */
export default defineComponent({
  name: 'NextQuery',
  xModule: nextQueriesXModule.name,
  components: { BaseSuggestion },
  props: {
    /**
     * The suggestion to render and use in the default slot.
     *
     * @public
     */
    suggestion: {
      type: Object as PropType<NextQueryModel>,
      required: true,
    },
    /**
     * Indicates if the curated next query should be highlighted.
     *
     * @public
     */
    highlightCurated: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    /**
     * Events list which are going to be emitted when a next query is selected.
     *
     * @returns The {@link XEvent} to emit.
     * @public
     */
    const events = computed(
      (): Partial<XEventsTypes> => ({ UserSelectedANextQuery: props.suggestion }),
    )

    /**
     * Checks if the next query is curated and if it should be highlighted.
     *
     * @returns True if the next query is curated and should be highlighted.
     *
     * @internal
     */
    const shouldHighlightCurated = computed(
      () => props.highlightCurated && (props.suggestion.isCurated ?? false),
    )

    return {
      events,
      shouldHighlightCurated,
    }
  },
})
</script>

<docs lang="mdx">
## Dynamic Classes

`NextQuery` uses the following dynamic CSS classes so you can style it when is:

- Curated: `x-next-query--is-curated`.

## Events

A list of events that the component will emit:

- [`UserSelectedANextQuery`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts):
  the event is emitted after the user clicks the button. The event payload is the next query data.

## Examples

This component expects just a suggestion as a prop to be rendered. It has a slot to override the
content. By default, it renders the suggestion query of the next query. It also has an optional
prop, `highlightCurated`, to indicate if the curated Next Queries should be differentiated with a
CSS class.

### Basic usage

Using default slot:

```vue live
<template>
  <NextQuery :suggestion="suggestion" />
</template>

<script setup>
import { NextQuery } from '@empathyco/x-components/next-queries'
import { ref } from 'vue'

const suggestion = ref({
  modelName: 'NextQuery',
  query: 'tshirt',
  facets: [],
})
</script>
```

### Overriding default slot

The default slot allows you to replace the content of the suggestion button.

```vue live
<template>
  <NextQuery :suggestion="suggestion" #default="{ suggestion }">
    <TrendingIcon />
    <span class="x-next-query__query" :aria-label="suggestion.query">{{ suggestion.query }}</span>
  </NextQuery>
</template>

<script setup>
import { NextQuery } from '@empathyco/x-components/next-queries'
import { TrendingIcon } from '@empathyco/x-components'
import { ref } from 'vue'

const suggestion = ref({
  modelName: 'NextQuery',
  query: 'tshirt',
  facets: [],
})
</script>
```
</docs>
