<template>
  <BaseSuggestions
    ref="baseSuggestionsRef"
    :suggestions="suggestions"
    :render-when-empty="requestOnlyWhenVisible"
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
          class="x-query-suggestions__suggestion xds:suggestion"
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
import { useElementVisibility } from '@vueuse/core'
import { computed, defineComponent, onBeforeUnmount, ref, watch } from 'vue'
import BaseSuggestions from '../../../components/suggestions/base-suggestions.vue'
import { useGetter, useState, useXBus } from '../../../composables'
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
    const xBus = useXBus()

    /** The module's list of suggestions. */
    const { querySuggestions } = useGetter('querySuggestions')
    const { config } = useState('querySuggestions')

    /** Whether the suggestions are only requested while this component is visible. */
    const requestOnlyWhenVisible = computed(() => config.value.requestOnlyWhenVisible)

    const baseSuggestionsRef = ref<InstanceType<typeof BaseSuggestions>>()

    /**
     * The root element of the suggestions list. It is `null` when nothing is rendered, as the
     * `$el` is then a comment node.
     */
    const element = computed(() => {
      const el: unknown = baseSuggestionsRef.value?.$el
      return el instanceof HTMLElement ? el : null
    })

    /**
     * Zero threshold so the empty list, which has no height, is detected as visible while it is in
     * the viewport.
     */
    const isElementVisible = useElementVisibility(element, { threshold: 0 })

    watch(isElementVisible, isVisible => {
      void xBus.emit('QuerySuggestionsVisibilityChanged', isVisible)
    })

    onBeforeUnmount(() => {
      void xBus.emit('QuerySuggestionsVisibilityChanged', false)
    })

    return { suggestions: querySuggestions, requestOnlyWhenVisible, baseSuggestionsRef }
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

## Events

A list of events that the component will emit:

- [`QuerySuggestionsVisibilityChanged`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts):
  the event is emitted when the component enters or leaves the viewport, and with `false` when it
  is unmounted. The event payload is whether the component is visible or not.

## Request only when visible

When the `requestOnlyWhenVisible` option of the query suggestions module config is enabled, the
suggestions are only requested while this component is visible in the viewport. If it becomes
visible again with the same request as the last one, the request is not repeated.

To detect its visibility, the component renders its root element even when there are no
suggestions, so keep in mind that an empty `ul.x-query-suggestions` element stays in the DOM.

```js
new XInstaller({
  // ...
  xModules: {
    querySuggestions: {
      config: {
        requestOnlyWhenVisible: true,
      },
    },
  },
}).init()
```

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
import { use$x } from '../../../composables/use-$x'

const x = use$x()
function emitSuggestionClickedEvents(event, suggestion) {
  x.emit('UserAcceptedAQuery', suggestion.query, {
    target: event.target
  })
  x.emit('UserSelectedASuggestion', suggestion, {
    target: event.target
  })
  x.emit('UserSelectedAQuerySuggestion', suggestion, {
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
