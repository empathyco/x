<script lang="ts">
import type { Ref } from 'vue'
import type { ListItem } from '../../../utils/types'
import type { NextQueriesGroup } from '../types'
import { computed, defineComponent, h, inject, provide } from 'vue'
import {
  HAS_MORE_ITEMS_KEY,
  LIST_ITEMS_KEY,
  QUERY_KEY,
} from '../../../components/decorators/injection.consts'
import ItemsList from '../../../components/items-list.vue'
import { useGetter } from '../../../composables/use-getter'
import { useState } from '../../../composables/use-state'
import { AnimationProp } from '../../../types/animation-prop'
import { groupItemsBy } from '../../../utils/array'
import { nextQueriesXModule } from '../x-module'

/**
 * Component that inserts groups of next queries in different positions of the injected search
 * items list, based on the provided configuration.
 *
 * @public
 */
export default defineComponent({
  name: 'NextQueriesList',
  xModule: nextQueriesXModule.name,
  props: {
    /** Animation component that will be used to animate the next queries groups. */
    animation: {
      type: AnimationProp,
      default: 'ul',
    },
    /** The first index to insert a group of next queries at. */
    offset: {
      type: Number,
      default: 24,
    },
    /** The items cycle size to keep inserting next queries groups at. */
    frequency: {
      type: Number,
      default: 24,
    },
    /** The maximum amount of next queries to add in a single group. */
    maxNextQueriesPerGroup: {
      type: Number,
      default: 4,
    },
    /** The maximum number of groups to insert into the injected list items list. */
    maxGroups: Number,
    /**
     * Determines if a group is added to the injected items list in case the number
     * of items is smaller than the offset.
     */
    showOnlyAfterOffset: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { slots }) {
    const { query, status } = useState('nextQueries')

    /** The state next queries. */
    const nextQueries = useGetter('nextQueries').nextQueries

    /** Injected query, updated when the related request(s) have succeeded. */
    const injectedQuery = inject<Ref<string>>(QUERY_KEY as string)

    /** Indicates if there are more available results than the injected. */
    const hasMoreItems = inject<Ref<boolean>>(HAS_MORE_ITEMS_KEY as string)

    /**
     * The grouped next queries based on the given config.
     *
     * @returns A list of next queries groups.
     */
    const nextQueriesGroups = computed<NextQueriesGroup[]>(() =>
      Object.values(
        groupItemsBy(nextQueries?.value, (_, index) =>
          Math.floor(index / props.maxNextQueriesPerGroup),
        ),
      )
        .slice(0, props.maxGroups)
        .map(nextQueries => ({
          modelName: 'NextQueriesGroup' as const,
          id: nextQueries.map(nextQuery => nextQuery.query).join(','),
          nextQueries,
        })),
    )

    /** It injects {@link ListItem} provided by an ancestor as injectedListItems. */
    const injectedListItems = inject<Ref<ListItem[]>>(LIST_ITEMS_KEY as string)

    /**
     * Checks if the next queries are outdated taking into account the injected query.
     *
     * @returns True if the next queries are outdated, false if not.
     */
    const nextQueriesAreOutdated = computed(
      () =>
        !!injectedQuery?.value &&
        (query.value !== injectedQuery.value || status.value !== 'success'),
    )

    /**
     * Checks if the number of items is smaller than the offset so a group
     * should be added to the injected items list.
     *
     * @returns True if a group should be added, false if not.
     */
    const hasNotEnoughListItems = computed(
      () =>
        !props.showOnlyAfterOffset &&
        !hasMoreItems?.value &&
        injectedListItems !== undefined &&
        injectedListItems.value.length > 0 &&
        props.offset > injectedListItems.value.length,
    )

    /**
     * New list of {@link ListItem}s to render.
     *
     * @returns The new list of {@link ListItem}s with the next queries groups inserted.
     */
    const items = computed(() => {
      if (!injectedListItems?.value) {
        return nextQueriesGroups.value
      }
      if (nextQueriesAreOutdated.value) {
        return injectedListItems.value
      }
      if (hasNotEnoughListItems.value) {
        return injectedListItems.value.concat(nextQueriesGroups.value[0] ?? [])
      }
      return nextQueriesGroups?.value.reduce(
        (items, nextQueriesGroup, index) => {
          const targetIndex = props.offset + props.frequency * index
          if (targetIndex <= items.length) {
            items.splice(targetIndex, 0, nextQueriesGroup)
          }
          return items
        },
        [...injectedListItems.value],
      )
    })

    /**
     * The computed list items of the entity that uses the mixin.
     *
     * @remarks It should be overridden in the component that uses the mixin and it's intended to be
     * filled with items from the state. Vue doesn't allow mixins as abstract classes.
     * @returns An empty array as fallback in case it is not overridden.
     */
    provide(LIST_ITEMS_KEY as string, items)

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

This component emits no events.

## See it in action

<!-- prettier-ignore-start -->
:::warning Backend microservice required
To use this component, the <b>QuerySignals</b> microservice must be
implemented.
:::
<!-- prettier-ignore-end -->

Usually, this component is going to be used together with the `ResultsList` one. Next queries groups
will be inserted between the results, guiding users to discover new searches directly from the
results list.

```vue live
<template>
  <div>
    <SearchInput />
    <ResultsList>
      <NextQueriesList />
    </ResultsList>
  </div>
</template>

<script setup>
import { NextQueriesList } from '@empathyco/x-components/next-queries'
import { ResultsList } from '@empathyco/x-components/search'
import { SearchInput } from '@empathyco/x-components/search-box'
</script>
```

### Play with the index that next queries groups are inserted at

The component allows to customise where are the next queries groups inserted. In the following
example, the first group of next queries will be inserted at the index `48` (`offset`), and then a
second group will be inserted at index `120` because of the `frequency` prop configured to `72`.
Finally, a third group will be inserted at index `192`. Because `maxGroups` is configured to `3`, no
more groups will be inserted. Each one of this groups will have up to `6` next queries
(`maxNextQueriesPerGroup`).

```vue live
<template>
  <div>
    <SearchInput />
    <ResultsList>
      <NextQueriesList :offset="48" :frequency="72" :maxNextQueriesPerGroup="6" :maxGroups="3" />
    </ResultsList>
  </div>
</template>

<script setup>
import { NextQueriesList } from '@empathyco/x-components/next-queries'
import { ResultsList } from '@empathyco/x-components/search'
import { SearchInput } from '@empathyco/x-components/search-box'
</script>
```

### Showing/hiding first next queries group when no more items

By default, the first next query group will be inserted when the total number of results is smaller
than the offset, but this behavior can be deactivated by setting the `showOnlyAfterOffset` to
`true`.

```vue live
<template>
  <div>
    <SearchInput />
    <ResultsList>
      <NextQueriesList
        :offset="48"
        :frequency="72"
        :maxNextQueriesPerGroup="1"
        :showOnlyAfterOffset="true"
      />
    </ResultsList>
  </div>
</template>

<script setup>
import { NextQueriesList } from '@empathyco/x-components/next-queries'
import { ResultsList } from '@empathyco/x-components/search'
import { SearchInput } from '@empathyco/x-components/search-box'
</script>
```

### Customize the layout of the component

This component will render by default the `id` of each search item, both the injected, and for the
groups of next queries generated, but the common case is to integrate it with another layout
component, for example the `BaseGrid`. To do so, you can use the `default` slot

```vue
<template>
  <div>
    <SearchInput />
    <ResultsList>
      <NextQueriesList
        :offset="48"
        :frequency="72"
        :maxNextQueriesPerGroup="6"
        :maxGroups="3"
        #default="{ items }"
      >
        <BaseGrid :items="items">
          <template #next-queries-group="{ item }">
            <span>NextQueriesGroup: {{ item.queries.join(', ') }}</span>
          </template>
          <template #result="{ item }">
            <span>Result: {{ item.name }}</span>
          </template>
          <template #default="{ item }">
            <span>Default: {{ item }}</span>
          </template>
        </BaseGrid>
      </NextQueriesList>
    </ResultsList>
  </div>
</template>

<script setup>
import { NextQueriesList } from '@empathyco/x-components/next-queries'
import { ResultsList } from '@empathyco/x-components/search'
import { SearchInput } from '@empathyco/x-components/search-box'
import { BaseGrid } from '@empathyco/x-components'
</script>
```
</docs>
