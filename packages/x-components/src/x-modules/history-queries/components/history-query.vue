<template>
  <div class="x-history-query x-suggestion-group">
    <!--
      Click on the History Query suggestion
      @event click
      @property {Suggestion} suggestion - History Query suggestion data
      @property {MouseEvent} event - The original mouse event
    -->
    <BaseSuggestion
      v-slot="baseScope"
      class="x-history-query__suggestion"
      :class="suggestionClass"
      v-bind="{ suggestion, suggestionSelectedEvents, query }"
      data-test="history-query"
      feature="history_query"
      @click="$emit('click', suggestion, $event)"
    >
      <!-- eslint-disable max-len -->
      <!--
          @slot History Query content
              @binding {Object} v-bind - `BaseSuggestion` default slot scope: **suggestion** <code>Suggestion</code> - Suggestion data<br /> **query** <code>string</code> - The query that the suggestion belongs to<br /> **filter** <code>Filter or undefined</code> - Suggestion's filter
      -->
      <!-- eslint-enable max-len -->
      <slot v-bind="{ ...baseScope }" />
    </BaseSuggestion>
    <RemoveHistoryQuery
      class="x-history-query__remove x-suggestion-group-button"
      :class="removeButtonClass"
      :history-query="suggestion"
      data-test="remove-history-query"
    >
      <!--
          @slot History Query remove button content
              @binding {Suggestion} suggestion - History Query suggestion data
      -->
      <slot name="remove-button-content" v-bind="{ suggestion }">✕</slot>
    </RemoveHistoryQuery>
  </div>
</template>

<script lang="ts">
import type { HistoryQuery as HistoryQueryModel } from '@empathyco/x-types'
import type { PropType } from 'vue'
import type { XEventsTypes } from '../../../wiring/events.types'
import { computed, defineComponent } from 'vue'
import BaseSuggestion from '../../../components/suggestions/base-suggestion.vue'
import { useGetter } from '../../../composables/use-getter'
import { historyQueriesXModule } from '../x-module'
import RemoveHistoryQuery from './remove-history-query.vue'

/**
 * This component renders a history query suggestion combining two buttons: one for selecting this
 * suggestion as the search query, and another one to remove this query suggestion from the
 * history queries.
 *
 * @public
 */
export default defineComponent({
  name: 'HistoryQuery',
  xModule: historyQueriesXModule.name,
  components: { RemoveHistoryQuery, BaseSuggestion },
  props: {
    /**
     * The history query suggestion to render.
     *
     * @public
     */
    suggestion: {
      type: Object as PropType<HistoryQueryModel>,
      required: true,
    },
    /** Class inherited by content element. */
    removeButtonClass: String,
    /** Class inherited by content element. */
    suggestionClass: String,
  },
  emits: ['click'],
  setup(props) {
    /**
     * The normalized query of the history-queries module.
     *
     * @internal
     */
    const query = useGetter('historyQueries').normalizedQuery

    /**
     * The list of events that are going to be emitted when the suggestion button is pressed.
     *
     * @internal
     * @returns The {@link XEvent} to emit.
     */
    const suggestionSelectedEvents = computed(
      (): Partial<XEventsTypes> => ({
        UserSelectedAHistoryQuery: props.suggestion,
      }),
    )

    return {
      query,
      suggestionSelectedEvents,
    }
  },
})
</script>

<docs lang="mdx">
## Events

A list of events that the component will emit:

- [`UserSelectedAHistoryQuery`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts):
  the event is emitted after the user clicks the button. The event payload is the history query
  data.

## Examples

### Basic usage

This component only requires a prop called `suggestion`.

```vue live
<template>
  <HistoryQuery :suggestion="suggestion" />
</template>

<script setup>
import { HistoryQuery } from '@empathyco/x-components/history-queries'
import { ref } from 'vue'

const suggestion = ref({
  modelName: 'HistoryQuery',
  query: 'trousers',
  facets: [],
})
</script>
```

### Customizing slots content

Suggestion and remove buttons contents can be customized.

The default slot allows you to replace the content of the suggestion button. It has two properties,
the suggestion itself, and a `string` of HTML with the matched query.

The other slot is called `remove-button-content`, and allows you to set the content of the button
that serves to remove this query from the history. This slot only has one property, the suggestion.

```vue live
<template>
  <HistoryQuery :suggestion="suggestion">
    <template #default="{ suggestion }">
      <HistoryIcon />
      <Highlight highlight="tro" :text="suggestion.query" />
    </template>

    <template #remove-button-content="{ suggestion }">
      <CrossIcon />
    </template>
  </HistoryQuery>
</template>

<script setup>
import { HistoryQuery } from '@empathyco/x-components/history-queries'
import { HistoryIcon, CrossIcon, Highlight } from '@empathyco/x-components'
import { ref } from 'vue'

const suggestion = ref({
  modelName: 'HistoryQuery',
  query: 'trousers',
  facets: [],
})
</script>
```

### Customizing the content with classes

The `suggestionClass` prop can be used to add classes to the history query suggestion.

```vue live
<template>
  <HistoryQuery :suggestion="suggestion" suggestionClass="x-custom-class" />
</template>

<script setup>
import { HistoryQuery } from '@empathyco/x-components/history-queries'
import { ref } from 'vue'

const suggestion = ref({
  modelName: 'HistoryQuery',
  query: 'trousers',
  facets: [],
})
</script>
```

The `removeButtonClass` prop can be used to add classes to the remove history query.

```vue live
<template>
  <HistoryQuery :suggestion="suggestion" removeButtonClass="x-custom-class" />
</template>

<script setup>
import { HistoryQuery } from '@empathyco/x-components/history-queries'
import { ref } from 'vue'

const suggestion = ref({
  modelName: 'HistoryQuery',
  query: 'trousers',
  facets: [],
})
</script>
```
</docs>
