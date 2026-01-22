<template>
  <BaseSuggestions
    v-if="suggestions.length"
    v-slot="baseSuggestionsScope"
    class="x-semantic-queries"
    :suggestions="suggestions"
  >
    <!--
      @slot Semantic Query content
      @binding {{suggestion: object - Suggestion data, index: number - Suggestion index}} v-bind
        BaseSuggestion bindings
    -->
    <slot name="suggestion" v-bind="baseSuggestionsScope">
      <SemanticQuery v-slot="baseSuggestionScope" :suggestion="baseSuggestionsScope.suggestion">
        <!--
          @slot Semantic Query content
          @binding {{suggestion: object - Suggestion data, query: string - The query that the
            suggestion belongs to}} v-bind SemanticQuery bindings
        -->
        <slot name="suggestion-content" v-bind="baseSuggestionScope" />
      </SemanticQuery>
    </slot>
  </BaseSuggestions>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import BaseSuggestions from '../../../components/suggestions/base-suggestions.vue'
import { useState } from '../../../composables'
import { semanticQueriesXModule } from '../x-module'
import SemanticQuery from './semantic-query.vue'

/**
 * Retrieves a list of semantic queries from the state and exposes them in the slots.
 *
 * @public
 */
export default defineComponent({
  name: 'SemanticQueries',
  xModule: semanticQueriesXModule.name,
  components: { BaseSuggestions, SemanticQuery },
  setup(_, { slots }) {
    /** The semantic queries from the state. */
    const suggestions = useState('semanticQueries').semanticQueries

    /**
     * Maps the list of semantic queries to a list of queries, to make it compatible with
     * other components.
     */
    const queries = computed(() => suggestions.value.map(suggestion => suggestion.query))

    /**
     * Finds a {@link @empathyco/x-types#Suggestion} given a query.
     *
     * @param query - The query to search.
     * @returns The {@link @empathyco/x-types#Suggestion} or undefined if not found.
     */
    function findSemanticQuery(query: string) {
      return suggestions.value.find(suggestion => suggestion.query === query)
    }

    /**
     * Render function to execute the `default` slot, binding `slotsProps` and getting only the
     * first `vNode` to avoid Fragments and Text root nodes.
     * If there are no suggestions, nothing is rendered.
     *
     * @remarks `slotProps` must be values without Vue reactivity and located inside the
     * render-function to update the binding data properly.
     *
     * @returns The root `vNode` of the `default` slot or empty string if there are
     * no suggestions.
     */
    function renderDefaultSlot() {
      const slotProps = {
        suggestions: suggestions.value,
        queries: queries.value,
        findSemanticQuery,
      }
      return suggestions.value.length ? slots.default?.(slotProps)[0] : ''
    }

    /* Hack to render through a render-function, the `default` slot or, in its absence,
       the component itself. It is the alternative for the NoElement antipattern. */
    const componentProps = { suggestions }
    return (slots.default ? renderDefaultSlot : componentProps) as typeof componentProps
  },
})
</script>

<docs lang="mdx">
## Events

This component doesn't emit events.

## See it in action

By default, the `SemanticQueries` component will render a list of semantic queries.

```vue
<template>
  <SemanticQueries />
</template>

<script setup>
import { SemanticQueries } from '@empathyco/x-components/semantic-queries'
</script>
```

### Play with props

The component has the following props:

- `maxItemsToRender` to limit the number of semantic queries to render.
- `animation` to specify the animation to be used to animate the semantic queries.

```vue live
<template>
  <SemanticQueries :animation="animation" :maxItemsToRender="3" />
</template>

<script setup>
import { SemanticQueries } from '@empathyco/x-components/semantic-queries'
import { FadeAndSlide } from '@empathyco/x-components'

const animation = FadeAndSlide
</script>
```

### Play with the default slot

The default slot is used to overwrite the whole content of the component.

```vue live
<template>
  <SemanticQueries #default="{ suggestions }">
    <section>
      <SlidingPanel>
        <div v-for="suggestion in suggestions" :key="suggestion.query">
          {{ suggestion.query }}
          {{ suggestion.distance }}
        </div>
      </SlidingPanel>
    </section>
  </SemanticQueries>
</template>

<script setup>
import { SemanticQueries } from '@empathyco/x-components/semantic-queries'
import { SlidingPanel } from '@empathyco/x-components'
</script>
```

The default slot also exposes an array of semantic queries mapped to strings, and a method to find a
semantic query given a string query.

This is useful if you need an array of string queries, but also need to retrieve the original
semantic query to use it in another element.

```vue live
<template>
  <SemanticQueries #default="{ queries, findSemanticQuery }">
    <section>
      <QueryPreviewList :queries="queries" #slot="{ query, results }">
        <div>
          <SemanticQuery :suggestion="findSemanticQuery(query)" #default="{ suggestion }">
            {{ suggestion.query }} ({{ suggestion.distance }})
          </SemanticQuery>
          <ul>
            <li v-for="result in results" :key="result.id">
              {{ result.name }}
            </li>
          </ul>
        </div>
      </QueryPreviewList>
    </section>
  </SemanticQueries>
</template>

<script setup>
import { SemanticQueries, SemanticQuery } from '@empathyco/x-components/semantic-queries'
import { QueryPreviewList } from '@empathyco/x-components/queries-preview'
</script>
```

### Play with the suggestion slot

The suggestion slot can be used to override each semantic query item.

In this example, the query will be rendered along with the distance.

```vue live
<template>
  <SemanticQueries #suggestion="{ suggestion: { query, distance } }">
    <span>
      ({{ distance }})
      {{ query }}
    </span>
  </SemanticQueries>
</template>

<script setup>
import { SemanticQueries } from '@empathyco/x-components/semantic-queries'
</script>
```

### Play with the suggestion-content slot

The suggestion-content slot can be used to override only the content, but keep using the
SemanticQuery component internally.

```vue live
<template>
  <SemanticQueries #suggestion-content="{ suggestion: { query, distance } }">
    <span>
      ({{ distance }})
      {{ query }}
    </span>
  </SemanticQueries>
</template>

<script setup>
import { SemanticQueries } from '@empathyco/x-components/semantic-queries'
</script>
```
</docs>
