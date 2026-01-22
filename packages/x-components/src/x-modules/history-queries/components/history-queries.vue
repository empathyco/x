<template>
  <BaseSuggestions
    :suggestions="historyQueriesWithResults"
    class="x-history-queries"
    data-test="history-queries"
  >
    <template #default="baseScope">
      <!-- eslint-disable max-len -->
      <!--
        @slot History Query item
            @binding {Object} v-bind - History Query suggestion attributes:<br />&nbsp;&nbsp;- **suggestion** <code>Suggestion</code> - History Query suggestion data<br />&nbsp;&nbsp;- **index** <code>number</code> - History Query suggestion index
      -->
      <!-- eslint-enable max-len -->
      <slot name="suggestion" v-bind="{ ...baseScope }">
        <HistoryQuery
          :suggestion="baseScope.suggestion"
          data-test="history-query-item"
          class="x-history-queries__item"
          suggestion-class="x-suggestion"
        >
          <template #default="historyQueryScope">
            <!-- eslint-disable max-len -->
            <!--
              @slot History Query content
                  @binding {Object} v-bind - History Query suggestion attributes:<br />&nbsp;&nbsp;- **suggestion** <code>Suggestion</code> - History Query suggestion data<br />&nbsp;&nbsp;- **index** <code>number</code> - History Query suggestion index
            -->
            <!-- eslint-enable max-len -->
            <slot name="suggestion-content" v-bind="{ ...baseScope, ...historyQueryScope }" />
          </template>
          <template #remove-button-content="removeHistoryQueryScope">
            <!-- eslint-disable max-len -->
            <!--
              @slot History Query remove button content
                  @binding {Object} v-bind - History Query suggestion attributes:<br />&nbsp;&nbsp;- **suggestion** <code>Suggestion</code> - History Query suggestion data<br />&nbsp;&nbsp;- **index** <code>number</code> - History Query suggestion index
            -->
            <!-- eslint-enable max-len -->
            <slot
              name="suggestion-remove-content"
              v-bind="{ ...baseScope, ...removeHistoryQueryScope }"
            />
          </template>
        </HistoryQuery>
      </slot>
    </template>
  </BaseSuggestions>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import BaseSuggestions from '../../../components/suggestions/base-suggestions.vue'
import { useGetter } from '../../../composables/use-getter'
import { historyQueriesXModule } from '../x-module'
import HistoryQuery from './history-query.vue'

/**
 * This component renders a list of suggestions coming from the user queries history.
 * Allows the user to select one of them, emitting the needed events. A history query is just
 * another type of suggestion that contains a query that the user has made in the past.
 *
 * @public
 */
export default defineComponent({
  name: 'HistoryQueries',
  xModule: historyQueriesXModule.name,
  components: {
    BaseSuggestions,
    HistoryQuery,
  },
  setup() {
    /**
     * The filtered list of history queries.
     *
     * @internal
     */
    const { historyQueriesWithResults } = useGetter('historyQueries')

    return {
      historyQueriesWithResults,
    }
  },
})
</script>

<!--eslint-disable max-len -->
<docs lang="mdx">
## Inherited props

This component inherits the [`BaseSuggestions`](../base-components/x-components.base-suggestions.md)
props.

| Name               | Description                                                       | Type     | Default |
| ------------------ | ----------------------------------------------------------------- | -------- | ------- |
| `animation`        | Animation component that will be used to animate the suggestions. | `Vue`    | `"ul"`  |
| `maxItemsToRender` | Number of popular searches to be rendered.                        | `number` |         |

## Events

This component doesn't emit events.

## See it in action

Here you have a basic example of how the HistoryQueries is rendered.

```vue live
<template>
  <div>
    <SearchInput />
    <HistoryQueries />
  </div>
</template>

<script setup>
import { SearchInput } from '@empathyco/x-components/search-box'
import { HistoryQueries } from '@empathyco/x-components/history-queries'
</script>
```

### Play with props

In this example, the history queries have been limited to render a maximum of 10 queries (by default
it is 5).

```vue live
<template>
  <div>
    <SearchInput />
    <HistoryQueries :maxItemsToRender="10" />
  </div>
</template>

<script setup>
import { SearchInput } from '@empathyco/x-components/search-box'
import { HistoryQueries } from '@empathyco/x-components/history-queries'
</script>
```

### Play with the animation

```vue live
<template>
  <div>
    <SearchInput />
    <HistoryQueries :animation="animation" />
  </div>
</template>

<script setup>
import { SearchInput } from '@empathyco/x-components/search-box'
import { HistoryQueries } from '@empathyco/x-components/history-queries'
import { FadeAndSlide } from '@empathyco/x-components'

const animation = FadeAndSlide
</script>
```

### Play with suggestion slot

In this example, the [`HistoryQuery`](./x-components.history-query.md) component is passed in the
`suggestion` slot (although any other component could potentially be passed).

```vue live
<template>
  <div>
    <SearchInput />
    <HistoryQueries #suggestion="{ suggestion }">
      <HistoryQuery :suggestion="suggestion" />
    </HistoryQueries>
  </div>
</template>

<script setup>
import { SearchInput } from '@empathyco/x-components/search-box'
import { HistoryQueries, HistoryQuery } from '@empathyco/x-components/history-queries'
</script>
```

### Play with suggestion-content slot

To continue the previous example, the [`HistoryQuery`](./x-components.history-query.md) component is
passed in the `suggestion-content` slot, but in addition, an HTML span tag for the text are also
passed.

```vue live
<template>
  <div>
    <SearchInput />
    <HistoryQueries #suggestion-content="{ suggestion }">
      <span>{{ suggestion.query }}</span>
    </HistoryQueries>
  </div>
</template>

<script setup>
import { SearchInput } from '@empathyco/x-components/search-box'
import { HistoryQueries } from '@empathyco/x-components/history-queries'
</script>
```

### Play with suggestion-content-remove slot

To continue the previous example, the [`HistoryQuery`](./x-components.history-query.md) component is
passed in the `suggestion-content` slot, but in addition, a cross icon is also passed to change the
icon to remove the history query.

```vue live
<template>
  <div>
    <SearchInput />
    <HistoryQueries #suggestion-remove-content="{ suggestion }">
      <CrossIcon />
    </HistoryQueries>
  </div>
</template>

<script setup>
import { SearchInput } from '@empathyco/x-components/search-box'
import { HistoryQueries } from '@empathyco/x-components/history-queries'
import { CrossIcon } from '@empathyco/x-components'
</script>
```
</docs>
