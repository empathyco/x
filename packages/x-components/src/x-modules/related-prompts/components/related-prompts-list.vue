<script lang="ts">
import type { Ref } from 'vue'
import type { ListItem } from '../../../utils/types'
import type { RelatedPromptsGroup } from '../types'
import { computed, defineComponent, h, inject, provide } from 'vue'
import {
  HAS_MORE_ITEMS_KEY,
  LIST_ITEMS_KEY,
  QUERY_KEY,
} from '../../../components/decorators/injection.consts'
import ItemsList from '../../../components/items-list.vue'
import { useState } from '../../../composables/use-state'
import { AnimationProp } from '../../../types/animation-prop'
import { groupItemsBy } from '../../../utils/array'
import { relatedPromptsXModule } from '../x-module'

/**
 * Component that inserts groups of related prompts in different positions of the injected search
 * items list, based on the provided configuration.
 *
 * @public
 */
export default defineComponent({
  name: 'RelatedPromptsList',
  xModule: relatedPromptsXModule.name,
  props: {
    /**
     * Animation component that will be used to animate the related prompts groups.
     */
    animation: {
      type: AnimationProp,
      default: 'ul',
    },
    /**
     * The first index to insert a group of related prompts at.
     */
    offset: {
      type: Number,
      default: 24,
    },
    /**
     * The items cycle size to keep inserting related prompts groups at.
     */
    frequency: {
      type: Number,
      default: 24,
    },
    /**
     * The maximum amount of related prompts to add in a single group.
     */
    maxRelatedPromptsPerGroup: {
      type: Number,
      default: 4,
    },
    /**
     * The maximum number of groups to insert into the injected list items list.
     */
    maxGroups: {
      type: Number,
      default: undefined,
    },
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
    /**
     * The state related prompts.
     */
    const { query, status, relatedPrompts } = useState('relatedPrompts')

    /**
     * Injected query, updated when the related request(s) have succeeded.
     */
    const injectedQuery = inject<Ref<string | undefined>>(QUERY_KEY as string)

    /**
     * Indicates if there are more available results than the injected.
     */
    const hasMoreItems = inject<Ref<boolean | undefined>>(HAS_MORE_ITEMS_KEY as string)

    /**
     * The grouped related prompts based on the given config.
     *
     * @returns A list of related prompts groups.
     */
    const relatedPromptsGroups = computed<RelatedPromptsGroup[]>(() =>
      Object.values(
        groupItemsBy(relatedPrompts.value, (_, index) =>
          Math.floor(index / props.maxRelatedPromptsPerGroup),
        ),
      )
        .slice(0, props.maxGroups)
        .map((relatedPrompts, index) => ({
          modelName: 'RelatedPromptsGroup' as const,
          id: `related-prompts-group-${index}`,
          relatedPrompts,
        })),
    )

    /**
     * It injects {@link ListItem} provided by an ancestor as injectedListItems.
     */
    const injectedListItems = inject<Ref<ListItem[]>>(LIST_ITEMS_KEY as string)

    /**
     * Checks if the related prompts are outdated taking into account the injected query.
     *
     * @returns True if the related prompts are outdated, false if not.
     */
    const relatedPromptsAreOutdated = computed(
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
     * @returns The new list of {@link ListItem}s with the related prompts groups inserted.
     */
    const items = computed((): ListItem[] => {
      if (!injectedListItems?.value) {
        return relatedPromptsGroups.value
      }
      if (relatedPromptsAreOutdated.value) {
        return injectedListItems.value
      }
      if (hasNotEnoughListItems.value) {
        return injectedListItems.value.concat(relatedPromptsGroups.value[0] ?? [])
      }
      return relatedPromptsGroups?.value.reduce(
        (items, relatedPromptsGroup, index) => {
          const targetIndex = props.offset + props.frequency * index
          if (targetIndex <= items.length) {
            items.splice(targetIndex, 0, relatedPromptsGroup)
          }
          return items
        },
        [...injectedListItems.value],
      )
    })

    /**
     * The computed list items of the entity that uses the mixin.
     *
     * @remarks It should be overridden in the component that uses the mixin and
     * it's intended to be filled with items from the state. Vue doesn't allow
     * mixins as abstract classes.
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

Usually, this component is going to be used together with the `ResultsList` one. Related prompts
groups will be inserted between the results, guiding users to discover new searches directly from
the results list.

```vue live
<template>
  <div>
    <SearchInput />
    <ResultsList>
      <RelatedPromptsList />
    </ResultsList>
  </div>
</template>

<script>
import { RelatedPromptsList } from '@empathyco/x-components/related-prompts'
import { ResultsList } from '@empathyco/x-components/search'
import { SearchInput } from '@empathyco/x-components/search-box'

export default {
  name: 'RelatedPromptsListDemo',
  components: {
    RelatedPromptsList,
    ResultsList,
    SearchInput,
  },
}
</script>
```

### Play with the position in the index

Play with the `offset` and `frequency` props, indicating the indices for inserting groups of related prompts.
The following example shows that only three groups of related prompts can be added, as the `maxGroups` prop
is set to `3`. The first group of related prompts is inserted at index `48` using the `offset` prop. Since the
`frequency` prop is set to `72`, the second and third groups are inserted at indices `120` and `192`, respectively.
Each group can contain up to `6` related prompts (`maxRelatedPromptsPerGroup`).

```vue live
<template>
  <div>
    <SearchInput />
    <ResultsList>
      <RelatedPromptsList
        :offset="48"
        :frequency="72"
        :maxRelatedPromptsPerGroup="6"
        :maxGroups="3"
      />
    </ResultsList>
  </div>
</template>

<script>
import { RelatedPromptsList } from '@empathyco/x-components/related-prompts'
import { ResultsList } from '@empathyco/x-components/search'
import { SearchInput } from '@empathyco/x-components/search-box'

export default {
  name: 'RelatedPromptsListDemo',
  components: {
    RelatedPromptsList,
    ResultsList,
    SearchInput,
  },
}
</script>
```

### Showing/hiding the first related prompts

By default, the first group of related prompts is inserted when the total number of results is
smaller than the offset. You can deactivate this behavior by setting the `showOnlyAfterOffset` prop to `true`.

In the following example, related prompts will be displayed regardless of the number of results being over `48`.

```vue live
<template>
  <div>
    <SearchInput />
    <ResultsList>
      <RelatedPromptsList
        :offset="48"
        :frequency="72"
        :maxRelatedPromptsPerGroup="1"
        :showOnlyAfterOffset="true"
      />
    </ResultsList>
  </div>
</template>

<script>
import { RelatedPromptsList } from '@empathyco/x-components/related-prompts'
import { ResultsList } from '@empathyco/x-components/search'
import { SearchInput } from '@empathyco/x-components/search-box'

export default {
  name: 'RelatedPromptsListDemo',
  components: {
    RelatedPromptsList,
    ResultsList,
    SearchInput,
  },
}
</script>
```

### Customize the component layout

By default, this component shows the `id` of each search item, both the injected and the groups of
related prompts generated. However, it's common to customize it using a layout component such as
the `BaseGrid` component. To do so, you can use the `default` slot as follows:

```vue
<template>
  <div>
    <SearchInput />
    <ResultsList>
      <RelatedPromptsList
        :offset="48"
        :frequency="72"
        :maxRelatedPromptsPerGroup="6"
        :maxGroups="3"
        #default="{ items }"
      >
        <BaseGrid :items="items" :animation="animation">
          <template #related-prompts-group="{ item }">
            <span v-for="const prompt of items.relatedPrompts">
              RelatedPromptsGroup:
              <pre>{{ prompt }}</pre>
            </span>
          </template>
          <template #result="{ item }">
            <span>Result: {{ item.name }}</span>
          </template>
          <template #default="{ item }">
            <span>Default: {{ item }}</span>
          </template>
        </BaseGrid>
      </RelatedPromptsList>
    </ResultsList>
  </div>
</template>

<script>
import { RelatedPromptsList } from '@empathyco/x-components/related-prompts'
import { ResultsList } from '@empathyco/x-components/search'
import { SearchInput } from '@empathyco/x-components/search-box'
import { BaseGrid } from '@empathyco/x-components'

export default {
  name: 'RelatedPromptsListDemo',
  components: {
    RelatedPromptsLis,
    ResultsList,
    BaseGrid,
    SearchInput,
  },
}
</script>
```
</docs>
