<template>
  <BaseSuggestions
    :suggestions="suggestions"
    class="x-query-suggestions"
    data-test="query-suggestions"
  >
    <template #default="baseScope">
      <!-- eslint-disable max-len -->
      <!--
        @slot Custom component that replaces the `QuerySuggestion` component
            @binding {Object} v-bind - Query Suggestion attributes:<br />&nbsp;&nbsp;- **suggestion** `Suggestion` - Query Suggestion data<br />&nbsp;&nbsp;- **index** `number` - Query Suggestion index
      -->
      <!-- eslint-enable max-len -->
      <slot name="suggestion" v-bind="{ ...baseScope }">
        <QuerySuggestion
          v-slot="querySuggestionScope"
          :suggestion="baseScope.suggestion"
          class="x-query-suggestions__suggestion x-suggestion"
        >
          <!-- eslint-disable max-len -->
          <!--
            @slot Custom content that replaces the `QuerySuggestion` default content
                @binding {Object} v-bind - Query Suggestion attributes:<br />&nbsp;&nbsp;- **suggestion** `Suggestion` - Query Suggestion data<br />&nbsp;&nbsp;- **index** `number` - Query Suggestion index
          -->
          <!-- eslint-enable max-len -->
          <slot name="suggestion-content" v-bind="{ ...baseScope, ...querySuggestionScope }" />
        </QuerySuggestion>
      </slot>
    </template>
  </BaseSuggestions>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import BaseSuggestions from '../../../components/suggestions/base-suggestions.vue'
import { useGetter } from '../../../composables'
import { querySuggestionsXModule } from '../x-module'
import QuerySuggestion from './query-suggestion.vue'

/**
 * This component renders a list of possible search queries to select from as a query is entered
 * in the input field. By default, this is a list of
 * [`QuerySuggestion`](./x-components.query-suggestion.md) components.
 *
 * @public
 */
export default defineComponent({
  name: 'QuerySuggestions',
  xModule: querySuggestionsXModule.name,
  components: { BaseSuggestions, QuerySuggestion },
  setup() {
    /** The module's list of suggestions. */
    const { querySuggestions } = useGetter('querySuggestions')

    return { suggestions: querySuggestions }
  },
})
</script>

<docs lang="mdx">
## Inherited props

This component inherits the [`BaseSuggestions`](../base-components/x-components.base-suggestions.md)
props.

| Name               | Description                                 | Type     | Default |
| ------------------ | ------------------------------------------- | -------- | ------- |
| `animation`        | Animation component for `QuerySuggestions`. | `Vue`    | `"ul"`  |
| `maxItemsToRender` | Number of query suggestions to be rendered. | `number` |         |

## See it in action

<!-- prettier-ignore-start -->
:::warning Backend microservice required
To use this component, the <b>Empathize</b> microservice must be
implemented.
:::
<!-- prettier-ignore-end -->

In this example, a list of query suggestions is displayed. See how the suggestions change as you
type “sandal”. If you click on a suggestion, the search term in the search input is updated and the
query suggestions are changed to reflect the new search term.

_Type “sandal” or another fashion term in the input field to try it out!_

```vue live
<template>
  <SearchInput />
  <QuerySuggestions />
</template>

<script setup>
import { QuerySuggestions } from '@empathyco/x-components/query-suggestions'
import { SearchInput } from '@empathyco/x-components/search-box'
</script>
```

### Play with props

In this example, an `StaggeredFadeAndSlide` animation component has been passed as prop, so that the
matching query suggestions are shuffled with a slight delay as more letters of the term are typed.

_Type “lipstick” or another fashion term in the input field to try it out!_

```vue live
<template>
  <SearchInput />
  <QuerySuggestions :animation="StaggeredFadeAndSlide" />
</template>

<script>
import Vue from 'vue'
import { QuerySuggestions } from '@empathyco/x-components/query-suggestions'
import { SearchInput } from '@empathyco/x-components/search-box'
import StaggeredFadeAndSlide from '@empathyco/x-components/animations/staggered-fade-and-slide.vue'
</script>
```

### Play with suggestion slot

Here, the `suggestion` binding property passes the suggestion data.

_Type “bag” or another fashion term in the input field to try it out!_

```vue live
<template>
  <SearchInput />
  <QuerySuggestions #suggestion="{ suggestion }">
    <QuerySuggestion :suggestion="suggestion" #default="{ suggestion }">
      <span>🔍</span>
      <span>{{ suggestion.query }}</span>
    </QuerySuggestion>
  </QuerySuggestions>
</template>

<script setup>
import { QuerySuggestion, QuerySuggestions } from '@empathyco/x-components/query-suggestions'
import { SearchInput } from '@empathyco/x-components/search-box'
</script>
```

<!-- prettier-ignore-start -->
::: danger
If you're not using the [`QuerySuggestion`](./query-suggestion.md) component, then
you must implement the `UserAcceptedAQuery` and `UserSelectedAQuerySuggestion` events in
`QuerySuggestions`.

```vue live
<template>
  <SearchInput />
  <QuerySuggestions #suggestion="{ suggestion }">
    <button @click="emitSuggestionClickedEvents($event, suggestion)">
      {{ suggestion.query }}
    </button>
  </QuerySuggestions>
</template>

<script setup>
import { QuerySuggestions } from '@empathyco/x-components/query-suggestions'
import { SearchInput } from '@empathyco/x-components/search-box'
import { useXBus } from '@empathyco/x-components'

const $x = useXBus()
function emitSuggestionClickedEvents(event, suggestion) {
  $x.emit('UserAcceptedAQuery', suggestion.query, {
    target: event.target
  })
  $x.emit('UserSelectedASuggestion', suggestion, {
    target: event.target
  })
  $x.emit('UserSelectedAQuerySuggestion', suggestion, {
    target: event.target
  })
}
</script>
```

:::
<!-- prettier-ignore-end -->

### Play with suggestion-content slot

In this example, the `suggestion` and `query` properties of the `suggestion-content` slot are used
to paint a suggestion with an icon.

_Type “trousers” or another toy in the input field to try it out!_

```vue live
<template>
  <div>
    <SearchInput />
    <QuerySuggestions #suggestion-content="{ suggestion, query }">
      <span>🔍</span>
      <Highlight :text="suggestion.query" :highlight="query" />
    </QuerySuggestions>
  </div>
</template>

<script setup>
import { QuerySuggestions } from '@empathyco/x-components/query-suggestions'
import { SearchInput } from '@empathyco/x-components/search-box'
import { Highlight } from '@empathyco/x-components'
</script>
```

## Extending the component

Components can be combined and communicate with each other. Commonly, the `QuerySuggestions`
component communicates with the [`SearchInput`](../search-box/x-components.search-input.md),
updating the term in the search input.

_Type “pants” or another toy in the input field to try it out!_

```vue live
<template>
  <div>
    <SearchInput />
    <QuerySuggestions />
  </div>
</template>

<script setup>
import { QuerySuggestions } from '@empathyco/x-components/query-suggestions'
import { SearchInput } from '@empathyco/x-components/search-box'
</script>
```
</docs>
