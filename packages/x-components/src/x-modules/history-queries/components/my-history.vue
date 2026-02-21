<template>
  <component :is="animation" v-if="hasHistoryQueries" class="x-my-history" tag="ul">
    <li
      v-for="(queries, date) in groupByDate"
      :key="date"
      class="x-my-history-item"
      data-test="my-history-item"
    >
      <slot name="date" :date="date">
        <span class="x-my-history-item__date" data-test="my-history-date">{{ date }}</span>
      </slot>
      <BaseSuggestions
        :suggestions="queries"
        class="x-my-history-queries"
        :class="queriesListClass"
        data-test="my-history-queries"
        :animation="animation"
      >
        <template #default="{ suggestion, index }">
          <!--
        @slot History Query item
            @binding {Suggestion} suggestion - History Query suggestion data
            @binding {number} index - History Query suggestion index
            @binding {() => string} formatTime - Callback to format time to `hh:mm [PM/AM]`
      -->
          <slot name="suggestion" v-bind="{ suggestion, index, formatTime }">
            <HistoryQuery
              :suggestion="suggestion"
              data-test="history-query-item"
              class="x-history-queries__item x-suggestion"
            >
              <template #default>
                <!--
              @slot History Query content
                  @binding {Suggestion} suggestion - History Query suggestion data
                  @binding {number} index - History Query suggestion index
                  @binding {() => string} formatTime - Callback to format time to `hh:mm [PM/AM]`
            -->
                <slot name="suggestion-content" v-bind="{ suggestion, index, formatTime }">
                  {{ suggestion.query }} - {{ formatTime(suggestion.timestamp) }}
                </slot>
              </template>
              <template #remove-button-content>
                <!--
              @slot History Query remove button content
                  @binding {Suggestion} suggestion - History Query suggestion data
                  @binding {number} index - History Query suggestion index
            -->
                <slot name="suggestion-remove-content" v-bind="{ suggestion, index }" />
              </template>
            </HistoryQuery>
          </slot>
        </template>
      </BaseSuggestions>
    </li>
  </component>
</template>

<script lang="ts">
import type { HistoryQuery as HistoryQueryType } from '@empathyco/x-types'
import type { Dictionary } from '@empathyco/x-utils'
import type { SnippetConfig } from '../../../x-installer/api/api.types'
import { computed, defineComponent, inject } from 'vue'
import BaseSuggestions from '../../../components/suggestions/base-suggestions.vue'
import { useState } from '../../../composables/use-state'
import { AnimationProp } from '../../../types/index'
import { groupItemsBy, isArrayEmpty } from '../../../utils/array'
import { historyQueriesXModule } from '../x-module'
import HistoryQuery from './history-query.vue'

/**
 * The component renders the full history of user searched queries grouped by the day
 * they were performed.
 *
 * @remarks
 *
 * Allows the user to select one of them, emitting the needed events.
 * A history query is just another type of suggestion that contains a query that the user has
 * made in the past.
 * @public
 */
export default defineComponent({
  name: 'MyHistory',
  xModule: historyQueriesXModule.name,
  components: {
    HistoryQuery,
    BaseSuggestions,
  },
  props: {
    /**
     * Animation component that will be used to animate the suggestions.
     *
     * @public
     */
    animation: {
      type: AnimationProp,
      default: 'ul',
    },
    /**
     * The current locale.
     *
     * @public
     */
    locale: {
      type: String,
      default: 'en',
    },
    /** Class inherited by content element. */
    queriesListClass: String,
  },
  setup(props) {
    /**
     * The list of history queries.
     *
     * @internal
     */
    const { historyQueries } = useState('historyQueries')

    /**
     * The provided {@link SnippetConfig}.
     *
     * @internal
     */
    const snippetConfig = inject<SnippetConfig | undefined>('snippetConfig')

    /**
     * The locale that it is going to be used. It can be the one send it by the snippet config or
     * the one pass it using the prop.
     *
     * @returns The locale to be used.
     * @internal
     */
    const usedLocale = computed(() => snippetConfig?.uiLang ?? snippetConfig?.lang ?? props.locale)

    /**
     * Returns a record of history queries grouped by date.
     *
     * @example
     * ```typescript
     *  const historyQueriesGrouped = {
     *    'Monday, January 10th, 2022' : [{
     *      query: 'lego',
     *      modelName: 'HistoryQuery',
     *      timestamp: 121312312
     *    }],
     *    'Tuesday, January 11th, 2022' : [{
     *      query: 'barbie',
     *      modelName: 'HistoryQuery',
     *      timestamp: 15221212
     *    }]
     *  }
     * ```
     * @returns The history queries grouped by date.
     * @internal
     */
    const groupByDate = computed((): Dictionary<HistoryQueryType[]> => {
      return groupItemsBy(historyQueries.value as HistoryQueryType[], current => {
        const formatted = new Date(current.timestamp).toLocaleDateString(usedLocale.value, {
          day: 'numeric',
          weekday: 'long',
          month: 'long',
          year: 'numeric',
        })
        return formatted.charAt(0).toUpperCase() + formatted.slice(1)
      })
    })

    /**
     * Formats a timestamp into `hh:mm [PM/AM]` format.
     *
     * @example
     * ```typescript
     * // locale 'es'
     * console.log(formatTime(Date.now()) // '16:54'.
     *
     * // locale 'en'
     * console.log(formatTime(Date.now()) // '16:54 PM'.
     * ```
     * @param timestamp - The timestamp to format.
     * @returns The formatted time.
     * @internal
     */
    const formatTime = (timestamp: number) =>
      new Date(timestamp).toLocaleTimeString(usedLocale.value, {
        hour: '2-digit',
        minute: '2-digit',
      })

    /**
     * The `hasHistoryQueries` computed property is a flag representing if there are history queries
     * stored.
     *
     * @returns True if there are history queries; false otherwise.
     * @internal
     */
    const hasHistoryQueries = computed(
      () => !isArrayEmpty(historyQueries.value as HistoryQueryType[]),
    )

    return {
      hasHistoryQueries,
      groupByDate,
      historyQueries,
      formatTime,
    }
  },
})
</script>

<style lang="css" scoped>
.x-my-history {
  display: flex;
  flex-flow: column nowrap;
}
</style>

<docs lang="mdx">
## Events

This component doesn't emit events.

## See it in action

Here you have a basic example of how the MyHistory is rendered.

```vue
<template>
  <MyHistory />
</template>

<script setup>
import { MyHistory } from '@empathyco/x-components/history-queries'
</script>
```

### Play with props

In this example, the my history has been configured to use the 'es' locale.

```vue
<template>
  <MyHistory locale="es" />
</template>

<script setup>
import { MyHistory } from '@empathyco/x-components/history-queries'
</script>
```

### Play with the animation

```vue
<template>
  <MyHistory :animation="animation" />
</template>

<script setup>
import { MyHistory } from '@empathyco/x-components/history-queries'
import { FadeAndSlide } from '@empathyco/x-components'

const animation = FadeAndSlide
</script>
```

### Play with suggestion slot

In this example, the [`HistoryQuery`](./x-components.history-query.md) component is passed in the
`suggestion` slot (although any other component could potentially be passed).

```vue
<template>
  <MyHistory #suggestion="{ suggestion }">
    <HistoryQuery :suggestion="suggestion" />
  </MyHistory>
</template>

<script setup>
import { MyHistory, HistoryQuery } from '@empathyco/x-components/history-queries'
</script>
```

### Play with suggestion-content slot

To continue the previous example, the [`HistoryQuery`](./x-components.history-query.md) component is
passed in the `suggestion-content` slot, but in addition, an HTML span tag for the text is also
passed.

```vue
<template>
  <MyHistory #suggestion-content="{ suggestion }">
    <span>{{ suggestion.query }}</span>
  </MyHistory>
</template>

<script setup>
import { MyHistory } from '@empathyco/x-components/history-queries'
</script>
```

### Play with date slot

In this example, an HTML span tag for the date is passed.

```vue
<template>
  <MyHistory #date="{ date }">
    <span>{{ date }}</span>
  </MyHistory>
</template>

<script setup>
import { MyHistory } from '@empathyco/x-components/history-queries'
</script>
```

### Play with suggestion-remove-content slot

To continue the previous example, the [`HistoryQuery`](./x-components.history-query.md) component is
passed in the `suggestion-remove-content` slot, but in addition, a cross icon is also passed to change the
icon to remove the history query.

```vue
<template>
  <MyHistory #suggestion-remove-content="{ suggestion }">
    <CrossIcon />
  </MyHistory>
</template>

<script setup>
import { MyHistory } from '@empathyco/x-components/history-queries'
import { CrossIcon } from '@empathyco/x-components'
</script>
```

### Customizing the items with classes

The `queriesListClass` prop can be used to add classes to the suggestions list.

```vue live
<template>
  <MyHistory queriesListClass="x-gap-16" />
</template>

<script setup>
import { MyHistory } from '@empathyco/x-components/history-queries'
</script>
```
</docs>
