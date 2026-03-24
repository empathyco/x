<template>
  <BaseSuggestion
    v-slot="baseScope"
    class="x-popular-search"
    :suggestion="suggestion"
    :suggestion-selected-events="events"
    data-test="popular-search"
    feature="popular_search"
  >
    <!-- eslint-disable max-len -->
    <!--
        @slot Popular Search content
          @binding {Object} v-bind - `BaseSuggestion` default slot scope: **suggestion** <code>Suggestion</code> - Suggestion data<br /> **query** <code>string</code> - The query that the suggestion belongs to<br /> **filter** <code>Filter \| undefined</code> - Suggestion's filter
    -->
    <!-- eslint-enable max-len -->
    <slot v-bind="{ ...baseScope }" />
  </BaseSuggestion>
</template>

<script lang="ts">
import type { Suggestion } from '@empathyco/x-types'
import type { PropType } from 'vue'
import type { XEventsTypes } from '../../../wiring/events.types'
import { computed, defineComponent } from 'vue'
import BaseSuggestion from '../../../components/suggestions/base-suggestion.vue'
import { popularSearchesXModule } from '../x-module'

/**
 * Renders a popular search item which receives the suggestion that will be rendered as a prop. It
 * exposes a default slot to change the popular search content. If the slot is not overridden,
 * it will render the suggestion query by default.
 *
 * @public
 */
export default defineComponent({
  name: 'PopularSearch',
  xModule: popularSearchesXModule.name,
  components: { BaseSuggestion },
  props: {
    /**
     * The suggestion to render and use in the default slot.
     *
     * @public
     */
    suggestion: {
      type: Object as PropType<Suggestion>,
      required: true,
    },
  },
  setup(props) {
    /**
     * Events list which are going to be emitted when a popular search is selected.
     *
     * @returns The {@link XEvent} to emit.
     * @public
     */
    const events = computed(
      (): Partial<XEventsTypes> => ({ UserSelectedAPopularSearch: props.suggestion }),
    )

    return { events }
  },
})
</script>

<docs lang="mdx">
## Events

A list of events that the component will emit:

- [`UserSelectedAPopularSearch`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts):
  the event is emitted after the user clicks the button. The event payload is the popular search
  data.

## Examples

This component expects just a suggestion as a prop to be rendered. It has a slot to override the
content. By default, it renders the suggestion query of the popular search.

### Basic usage

```vue live
<template>
  <PopularSearch :suggestion="suggestion" />
</template>

<script setup>
import { PopularSearch } from '@empathyco/x-components/popular-searches'
import { ref } from 'vue'
const suggestion = ref({
  modelName: 'PopularSearch',
  query: 'tshirt',
  facets: [],
})
</script>
```

### Custom usage

```vue live
<template>
  <PopularSearch :suggestion="suggestion">
    <template #default="{ suggestion }">
      <TrendingIcon />
      <span :aria-label="suggestion.query">{{ suggestion.query }}</span>
    </template>
  </PopularSearch>
</template>

<script setup>
import { PopularSearch } from '@empathyco/x-components/popular-searches'
import { TrendingIcon } from '@empathyco/x-components'
import { ref } from 'vue'
const suggestion = ref({
  modelName: 'PopularSearch',
  query: 'tshirt',
  facets: [],
})
</script>
```
</docs>
