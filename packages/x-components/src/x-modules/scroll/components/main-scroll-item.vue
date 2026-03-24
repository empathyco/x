<template>
  <component :is="tag" ref="rootRef" :data-scroll="item.id">
    <slot />
  </component>
</template>

<script lang="ts">
import type { Identifiable } from '@empathyco/x-types'
import type { Component, PropType, Ref, WatchCallback } from 'vue'
import type { ScrollVisibilityObserver } from './scroll.types'
import { defineComponent, inject, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useState } from '../../../composables/use-state'
import { useXBus } from '../../../composables/use-x-bus'
import { scrollXModule } from '../x-module'
import { ScrollObserverKey } from './scroll.const'

/**
 * Wrapper for elements contained in the {@link MainScroll} that should store/restore its
 * position.
 *
 * @public
 */
export default defineComponent({
  name: 'MainScrollItem',
  xModule: scrollXModule.name,
  props: {
    /** The item data. Used to set the scroll identifier. */
    item: {
      type: Object as PropType<Identifiable>,
      required: true,
    },
    /** The tag to render. */
    tag: {
      type: [String, Object] as PropType<string | Component>,
      default: 'div',
    },
  },
  setup(props) {
    const xBus = useXBus()

    /** Rendered HTML node. */
    const rootRef = ref<HTMLElement>()

    /**
     * Pending identifier scroll position to restore. If it matches the {@link MainScrollItem} item
     * `id` property, this component should be scrolled into view.
     */
    const { pendingScrollTo } = useState('scroll')

    /** Observer to detect the first visible element. */
    const firstVisibleItemObserver = inject<Ref<ScrollVisibilityObserver> | null>(
      ScrollObserverKey as string,
      null,
    )

    /**
     * Initialises the element visibility observation, stopping the previous one if it has.
     *
     * @param newObserver - The new observer for the HTML element.
     * @param oldObserver - The old observer for the HTML element.
     */
    const observeItem: WatchCallback<ScrollVisibilityObserver> = (
      newObserver: ScrollVisibilityObserver | null,
      oldObserver: ScrollVisibilityObserver | null,
    ): void => {
      if (rootRef.value) {
        oldObserver?.unobserve(rootRef.value)
        newObserver?.observe(rootRef.value)
        if (pendingScrollTo.value === props.item.id) {
          nextTick(() => {
            rootRef.value!.scrollIntoView({
              block: 'center',
            })
          })
          xBus.emit('ScrollRestoreSucceeded')
        }
      }
    }

    /** Detaches the observer from the rendered element to prevent memory leaks. */
    onBeforeUnmount(() => {
      if (rootRef.value) {
        firstVisibleItemObserver?.value.unobserve(rootRef.value)
      }
    })

    /**
     * Initialise scroll behavior.
     * - Observes the rendered element to detect if it is the first visible item.
     * - If the rendered element matches the {@link MainScrollItem.pendingScrollTo}, scrolls the
     * element into the first position of the view.
     */
    onMounted(() => {
      nextTick(() => {
        // Mounted does not guarantee that child components are mounted too
        if (firstVisibleItemObserver) {
          watch(firstVisibleItemObserver, observeItem, { immediate: true })
        }
      })
    })

    return { rootRef }
  },
})
</script>

<docs lang="mdx">
## Events

This component emits the following event:

- [`ScrollRestoreSucceeded`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts)

## See it in action

This component has no predefined template. It renders whatever you decide using the `tag` prop. It's
main purpose is to help storing and restoring the scroll position so URLs can be shared, and also to
allow users to smoothly navigate back and forth.

To do so, it must be wrapped with the `MainScroll` component. In the following example we make use
of all of these components. The URL is modified as the user scrolls.

```vue
<template>
  <div>
    <UrlHandler />
    <SearchInput />

    <MainScroll>
      <Scroll>
        <ResultsList #result="{ item }">
          <MainScrollItem :item="item" tag="article">
            <BaseResultLink :item="item">
              <img :src="item.images[0]" />
              <p>{{ item.title }}</p>
            </BaseResultLink>
          </MainScrollItem>
        </ResultsList>
      </Scroll>
    </MainScroll>
  </div>
</template>

<script setup>
import { MainScroll, Scroll, MainScrollItem } from '@empathyco/x-components/scroll'
import { ResultsList } from '@empathyco/x-components/search'
import { SearchInput } from '@empathyco/x-components/search-box'
import { UrlHandler } from '@empathyco/x-components/url'
import { BaseResultLink } from '@empathyco/x-components'
</script>
```
</docs>
