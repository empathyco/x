<template>
  <BaseSuggestions
    :suggestions="renderedNextQueries"
    data-test="next-queries"
    class="x-next-queries"
  >
    <template #default="baseScope">
      <!-- eslint-disable max-len -->
      <!--
        @slot Next Query item
            @binding {Object} v-bind - Next Query suggestion attributes:<br />&nbsp;&nbsp;- **suggestion** <code>Suggestion</code> - Next Query suggestion data<br />&nbsp;&nbsp;- **index** <code>number</code> - Next Query suggestion index
            @binding {boolean} highlightCurated - True if the curated NQs should be highlighted
      -->
      <!-- eslint-enable max-len -->
      <slot name="suggestion" v-bind="{ ...baseScope, highlightCurated }">
        <NextQuery
          v-slot="nextQueryScope"
          :suggestion="baseScope.suggestion"
          :highlight-curated="highlightCurated"
          class="x-next-queries__suggestion x-suggestion"
        >
          <!-- eslint-disable max-len -->
          <!--
              @slot Next Query content
                  @binding {Object} v-bind - Next Query suggestion attributes:<br />&nbsp;&nbsp;- **suggestion** <code>Suggestion</code> - Next Query suggestion data<br />&nbsp;&nbsp;- **index** <code>number</code> - Next Query suggestion index
                  @binding {boolean} shouldHighlightCurated - True if the curated NQ should be highlighted
          -->
          <!-- eslint-enable max-len -->
          <slot name="suggestion-content" v-bind="{ ...baseScope, ...nextQueryScope }" />
        </NextQuery>
      </slot>
    </template>
  </BaseSuggestions>
</template>

<script lang="ts">
import type { NextQuery as NextQueryModel } from '@empathyco/x-types'
import type { PropType } from 'vue'
import { computed, defineComponent } from 'vue'
import BaseSuggestions from '../../../components/suggestions/base-suggestions.vue'
import { useGetter } from '../../../composables/use-getter'
import { nextQueriesXModule } from '../x-module'
import NextQuery from './next-query.vue'

/**
 * Simple next-queries component that renders a list of
 * [`BaseSuggestions`](./x-components.base-suggestions.md),
 * allowing the user to select one of them, and emitting the needed events. A next query is a
 * suggestion for a new search, related to your previous query. I.e. If people normally search
 * for `shirts`, and then `trousers`, `trousers` would be a next query of `shirts`.
 *
 * @public
 */
export default defineComponent({
  name: 'NextQueries',
  xModule: nextQueriesXModule.name,
  components: {
    NextQuery,
    BaseSuggestions,
  },
  props: {
    /**
     * Flag to indicate if the curated next queries should be displayed different.
     *
     * @public
     */
    highlightCurated: {
      type: Boolean,
      default: false,
    },
    /**
     * NextQueries list to be used instead of state NextQueries.
     *
     * @public
     */
    suggestions: Array as PropType<NextQueryModel[]>,
  },
  setup(props) {
    /**
     * The list of next queries from the state.
     *
     * @internal
     */
    const stateNextQueries = useGetter('nextQueries').nextQueries

    /**.
     * The list of next queries finally rendered
     *
     * @internal
     */
    const renderedNextQueries = computed(() => props.suggestions ?? stateNextQueries.value)

    return { renderedNextQueries }
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

## Examples

### Basic example

You don't need to pass any props, or slots. Simply add the component, and when it has any next
queries it will show them

```vue live
<template>
  <div>
    <SearchInput />
    <NextQueries />
  </div>
</template>

<script setup>
import { SearchInput } from '@empathyco/x-components/search-box'
import { NextQueries } from '@empathyco/x-components/next-queries'
</script>
```

The component has three optional props. `animation` to render the component with an animation,
`maxItemsToRender` to limit the number of next queries rendered (by default it is 5), and
`highlightCurated` to indicate if the curated Next Queries inside the list should be highlighted.

```vue live
<template>
  <div>
    <SearchInput />
    <NextQueries :animation="animation" :maxItemsToRender="10" :highlightCurated="true" />
  </div>
</template>

<script setup>
import { SearchInput } from '@empathyco/x-components/search-box'
import { NextQueries } from '@empathyco/x-components/next-queries'
import { FadeAndSlide } from '@empathyco/x-components'

const animation = FadeAndSlide
</script>
```

### Overriding Next Queries' Content

You can use your custom implementation of the Next Query's content. In the example below, instead of
using the default Next Query's content, an icon is added, as well as a span with the query of the
Next Query suggestion.

```vue live
<template>
  <div>
    <SearchInput />
    <NextQueries>
      <template #suggestion-content="{ suggestion }">
        <TrendingIcon />
        <span class="x-next-query__query">{{ suggestion.query }}</span>
      </template>
    </NextQueries>
  </div>
</template>

<script setup>
import { SearchInput } from '@empathyco/x-components/search-box'
import { NextQueries } from '@empathyco/x-components/next-queries'
import { TrendingIcon } from '@empathyco/x-components'
</script>
```

### Adding a custom next query component

You can use your custom implementation of a next query component. To work correctly, it should use
the `emitNextQuerySelected` function when the next query is selected. In the example below, instead
of using the default `button` tag for a next query, an icon is added, and the text of the next query
is wrapped in a `span`.

```vue live
<template>
  <div>
    <SearchInput />
    <NextQueries>
      <template #suggestion="{ suggestion }">
        <NextQuery :suggestion="suggestion" class="x-next-queries__suggestion">
          <template #default="{ suggestion }">
            <TrendingIcon />
            <span class="x-next-query__query">{{ suggestion.query }}</span>
          </template>
        </NextQuery>
        <button>Custom Behaviour</button>
      </template>
    </NextQueries>
  </div>
</template>

<script setup>
import { SearchInput } from '@empathyco/x-components/search-box'
import { NextQueries, NextQuery } from '@empathyco/x-components/next-queries'
import { TrendingIcon } from '@empathyco/x-components'
</script>
```
</docs>
