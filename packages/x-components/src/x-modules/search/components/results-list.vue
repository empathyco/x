<script lang="ts">
import type { RequestStatus } from '../../../store/utils/status-store.utils'
import { computed, defineComponent, h, provide, ref, watch } from 'vue'
import {
  HAS_MORE_ITEMS_KEY,
  LIST_ITEMS_KEY,
  QUERY_KEY,
} from '../../../components/decorators/injection.consts'
import ItemsList from '../../../components/items-list.vue'
import { useState } from '../../../composables/use-state'
import { AnimationProp } from '../../../types'
import { searchXModule } from '../x-module'

/**
 * It renders a {@link ItemsList} list with the results from {@link SearchState.results} by
 * default.
 *
 * The component provides a default slot which wraps the whole component with the `results` bound.
 *
 * It also provides the slot result to customize the item, which is within the default slot, with
 * the result bound.
 *
 * @public
 */
export default defineComponent({
  name: 'ResultsList',
  xModule: searchXModule.name,
  props: {
    /** Animation component that will be used to animate the results. */
    animation: {
      type: AnimationProp,
      default: 'ul',
    },
  },
  emits: ['UserReachedResultsListEnd'],
  setup(props, { slots }) {
    /**
     * The results to render from the state.
     *
     * @remarks The results list are provided with `items` key. It can be
     * concatenated with list items from components such as `BannersList`, `PromotedsList`,
     * `BaseGrid` or any component that injects the list.
     */
    const {
      query: searchQuery,
      totalResults,
      results: items,
      status: searchStatus,
    } = useState('search')

    provide(LIST_ITEMS_KEY as string, items)

    /** This query is updated only when the search request has succeeded. */
    const providedQuery = ref('')
    provide(QUERY_KEY as string, providedQuery)

    /** Indicates if there are more available results that have not been injected. */
    const hasMoreItems = computed(() => items.value.length < totalResults.value)
    provide(HAS_MORE_ITEMS_KEY as string, hasMoreItems)

    /**
     * Updates the query to be provided to the child components
     * when the search request has succeeded.
     *
     * @param status - The status of the search request.
     */
    function updateQuery(status: RequestStatus) {
      if (status === 'success') {
        providedQuery.value = searchQuery.value
      }
    }

    /**
     * Watches the searchStatus and triggers updateQuery as callback
     * when it changes.
     *
     * @param status - The status of the search request.
     */
    watch(searchStatus, () => updateQuery(searchStatus.value), { immediate: true })

    return () => {
      const innerProps = { items: items.value, animation: props.animation }
      // https://vue-land.github.io/faq/forwarding-slots#passing-all-slots
      return slots.default?.(innerProps)[0] ?? h(ItemsList, innerProps, slots)
    }
  },
})
</script>

<docs lang="mdx">
## Events

This component doesn't emit events.

## See it in action

<!-- prettier-ignore-start -->
:::warning Backend service required
To use this component, the Search service must be implemented.
:::
<!-- prettier-ignore-end -->

Here you have a basic example of how the ResultsList is rendered.

_Type any term in the input field to try it out!_

```vue
<template>
  <div>
    <SearchInput />
    <ResultsList />
  </div>
</template>

<script setup>
import { ResultsList } from '@empathyco/x-components/search'
import { SearchInput } from '@empathyco/x-components/search-box'
</script>
```

### Play with the animation

```vue
<template>
  <div>
    <SearchInput />
    <ResultsList :animation="fadeAndSlide" />
  </div>
</template>

<script setup>
import { ResultsList } from '@empathyco/x-components/search'
import { SearchInput } from '@empathyco/x-components/search-box'
import { FadeAndSlide } from '@empathyco/x-components/animations'

const fadeAndSlide = FadeAndSlide
</script>
```

### Overriding default content

```vue
<template>
  <div>
    <SearchInput />
    <ResultsList #default="{ items, animation }">
      <BaseGrid :items="items" :animation="animation">
        <template #result="{ item }">
          <span>Result: {{ item.name }}</span>
        </template>
        <template #default="{ item }">
          <span>Default: {{ item }}</span>
        </template>
      </BaseGrid>
    </ResultsList>
  </div>
</template>

<script setup>
import { ResultsList } from '@empathyco/x-components/search'
import { SearchInput } from '@empathyco/x-components/search-box'
import { BaseGrid } from '@empathyco/x-components'
</script>
```

### Overriding result content

```vue
<template>
  <div>
    <SearchInput />
    <ResultsList #result="{ item }">
      <span class="result">
        {{ item.name }}
      </span>
    </ResultsList>
  </div>
</template>

<script setup>
import { SearchInput } from '@empathyco/x-components/search-box'
import { ResultsList } from '@empathyco/x-components/search'
</script>
```

### Data injection

Starting with the `ResultsList` component as root element, you can concat the list of list items
using `BannersList`, `PromotedsList`, `BaseGrid` or any component that injects the `listItems`
value.

The order in which elements are placed in the template will define the concat strategy of the items,
so it is important to define it properly; for example, Promoteds will be usually before Banners so
first promoted items are inserted within the results and then banner items are placed on top of
that, occupying the rows.

```vue
<template>
  <div>
    <SearchInput />
    <ResultsList>
      <PromotedsList>
        <BannersList>
          <template #result="{ item }">Result: {{ item.id }}</template>
          <template #banner="{ item }">Banner: {{ item.id }}</template>
          <template #promoted="{ item }">Promoted: {{ item.id }}</template>
        </BannersList>
      </PromotedsList>
    </ResultsList>
  </div>
</template>

<script setup>
import { ResultsList, BannersList, PromotedsList } from '@empathyco/x-components/search'
import { SearchInput } from '@empathyco/x-components/search-box'
</script>
```
</docs>
