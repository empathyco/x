<script lang="ts">
import type { Ref } from 'vue'
import type { FeatureLocation } from '../../../types/origin'
import type { ListItem } from '../../../utils/types'
import { computed, defineComponent, h, inject, isRef, provide, ref } from 'vue'
import { LIST_ITEMS_KEY } from '../../../components/decorators/injection.consts'
import ItemsList from '../../../components/items-list.vue'
import { use$x } from '../../../composables/use-$x'
import { useState } from '../../../composables/use-state'
import { AnimationProp } from '../../../types/animation-prop'
import { getIndexForRow } from '../utils'
import { vendorXModule } from '../x-module'

/**
 * It renders a {@link ItemsList} of vendor related prompts groups from
 * {@link VendorState.relatedPromptsGroups}.
 *
 * Each group is inserted in the injected list items as a full-width item that starts the grid row
 * defined in its `row` field. The rows are computed with the number of columns rendered by the
 * grid, so this component should be the closest wrapper of the `BaseGrid`.
 *
 * The component provides a default slot which wraps the whole component with the vendor related
 * prompts groups plus the `injectedListItems` which also contains the injected list items from
 * the ancestor.
 *
 * It also provides the parent slots to customize the items.
 *
 * @public
 */
export default defineComponent({
  name: 'VendorRelatedPromptsList',
  xModule: vendorXModule.name,
  props: {
    /** Animation component that will be used to animate the vendor related prompts groups. */
    animation: {
      type: AnimationProp,
      default: 'ul',
    },
  },
  setup(props, { slots }) {
    const $x = use$x()

    /** The vendor related prompts groups to render from the vendor state. */
    const relatedPromptsGroups = useState('vendor').relatedPromptsGroups

    /** The vendor related prompts groups sorted by their row. */
    const stateItems = computed(() =>
      [...relatedPromptsGroups.value].sort((groupA, groupB) => groupA.row - groupB.row),
    )

    /** The injected location, used to listen only to the columns of the grid in this location. */
    const injectedLocation = inject<Ref<FeatureLocation> | FeatureLocation>('location')
    const location = isRef(injectedLocation) ? injectedLocation.value : injectedLocation

    /** Number of columns rendered by the grid. */
    const columnsNumber = ref(0)

    $x.on('RenderedColumnsNumberChanged', true).subscribe(({ eventPayload, metadata }) => {
      if (metadata.location === location) {
        columnsNumber.value = eventPayload
      }
    })

    /** It injects {@link ListItem} provided by an ancestor as injectedListItems. */
    const injectedListItems = inject<Ref<ListItem[]>>(LIST_ITEMS_KEY as string)

    /**
     * Indicates if all the results have been loaded, to know if the groups can be inserted in rows
     * of not yet loaded pages.
     */
    const areAllPagesLoaded = computed(() => $x.results.length === $x.totalResults)

    /**
     * The `stateItems` inserted in their rows of the `injectedListItems` if there are.
     *
     * @remarks The groups are not inserted until the number of columns of the grid is known. If
     * the row of a group is beyond the loaded items, it waits for the next pages to be loaded, or
     * it is appended at the end of the list if all the pages are already loaded.
     *
     * @returns List of {@link ListItem}.
     */
    const items = computed((): ListItem[] => {
      if (!injectedListItems?.value?.length) {
        return stateItems.value
      }
      if (!stateItems.value.length || columnsNumber.value <= 0) {
        return injectedListItems.value
      }
      const items = [...injectedListItems.value]
      for (const item of stateItems.value) {
        let index = getIndexForRow(items, item.row, columnsNumber.value)
        if (index === -1) {
          if (!areAllPagesLoaded.value) {
            break
          }
          index = items.length
        }
        items.splice(index, 0, item)
      }
      return items
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

This component doesn't emit events. The related prompts are provided by the x consumer emitting
the `VendorRelatedPromptsChanged` event, and the component that renders each prompt should emit
`VendorRelatedPromptMounted`, `UserViewedAVendorRelatedPrompt` and
`UserClickedAVendorRelatedPrompt` so the vendor tagging URLs are called.

## See it in action

The x consumer emits the vendor related prompts groups, each one with the grid row (1-based) where
it has to be inserted. They are reset every time the vendor query changes, so the consumer should
listen to the `VendorQueryChanged` event to provide them again.

```js
const x = window.InterfaceX
x.on('VendorQueryChanged').subscribe(async query => {
  const prompts = await myVendor.getPrompts(query)
  x.emit('VendorRelatedPromptsChanged', [
    {
      id: 'campaign-1',
      row: 2,
      title: 'Ask the brand · Sponsored',
      metadata: { campaignId: 'campaign-1' },
      relatedPrompts: prompts.map(prompt => ({
        suggestionText: prompt.text,
        nextQueries: [],
        type: 'SPONSORED',
        metadata: { productId: prompt.productId },
        tagging: {
          mountedUrl: prompt.mountedUrl,
          viewUrl: prompt.viewUrl,
          clickUrl: prompt.clickUrl,
        },
      })),
    },
  ])
})
```

The `VendorRelatedPromptsList` should be the closest wrapper of the `BaseGrid`, so the rows are
computed with all the other items already inserted in the list. Each group is rendered in the
`vendor-related-prompts-group` slot of the grid, taking the full width of the row.

```vue
<template>
  <ResultsList>
    <VendorResultsList>
      <VendorBannersList>
        <VendorRelatedPromptsList>
          <BaseGrid>
            <template #result="{ item }">
              <span>Result: {{ item.name }}</span>
            </template>
            <template #vendor-related-prompts-group="{ item: group }">
              <h3>{{ group.title }}</h3>
              <RelatedPrompt
                v-for="relatedPrompt in group.relatedPrompts"
                :key="relatedPrompt.suggestionText"
                :related-prompt="relatedPrompt"
                @click="x.emit('UserClickedAVendorRelatedPrompt', relatedPrompt)"
              />
            </template>
          </BaseGrid>
        </VendorRelatedPromptsList>
      </VendorBannersList>
    </VendorResultsList>
  </ResultsList>
</template>

<script setup>
import { BaseGrid, use$x } from '@empathyco/x-components'
import { RelatedPrompt } from '@empathyco/x-components/related-prompts'
import { ResultsList } from '@empathyco/x-components/search'
import {
  VendorBannersList,
  VendorRelatedPromptsList,
  VendorResultsList,
} from '@empathyco/x-components/vendor'

const x = use$x()
</script>
```
</docs>
