<script lang="ts">
import type { ScrollVisibilityObserver } from './scroll.types'
import {
  computed,
  defineComponent,
  getCurrentInstance,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  watch,
} from 'vue'
import { DISABLE_ANIMATIONS_KEY } from '../../../components/decorators/injection.consts'
import { useState } from '../../../composables/use-state'
import { useXBus } from '../../../composables/use-x-bus'
import { scrollXModule } from '../x-module'
import { ScrollObserverKey } from './scroll.const'

/**
 * Extends the scroll making it able to sync the first visible element, and allowing
 * the children position to be restored.
 *
 * Each child element that wants to have this support must be wrapped in a {@link MainScrollItem}
 * component.
 *
 * @public
 */
export default defineComponent({
  name: 'MainScroll',
  xModule: scrollXModule.name,
  props: {
    /**
     * If `true`, sets this scroll instance to the main of the application. Being the main
     * scroll implies that features like restoring the scroll when the query changes, or storing
     * the scroll position in the URL will be enabled for this container.
     */
    useWindow: {
      type: Boolean,
      default: false,
    },
    /**
     * Timeout in milliseconds to abort trying to restore the scroll position to the target
     * element.
     */
    restoreScrollTimeoutMs: {
      type: Number,
      default: 5000,
    },
    /** Intersection percentage to consider an element visible. */
    threshold: {
      type: Number,
      default: 0.3,
    },
    /** Adjusts the size of the scroll container bounds. */
    margin: {
      type: String,
      default: '0px',
    },
  },
  setup(props, { slots }) {
    const xBus = useXBus()

    /** The reference to the root element of the component. */
    const rootRef = ref<Element>()
    /** The elements that are currently considered visible. */
    const intersectingElements = ref<HTMLElement[]>([])

    /** Intersection observer to determine visibility of the elements. */
    const intersectionObserver = ref<IntersectionObserver | null>(null)

    /**
     * Pending identifier scroll position to restore. If it matches the {@link MainScrollItem} item
     * `id` property, this component should be scrolled into view.
     */
    const { pendingScrollTo } = useState('scroll')

    /** Disables the animations. */
    const disableAnimations = computed((): boolean => !!pendingScrollTo.value)
    provide(DISABLE_ANIMATIONS_KEY as string, disableAnimations)

    /**
     * Removes an element from the {@link MainScroll.intersectingElements} list.
     *
     * @param element - The element to remove from the visible elements.
     */
    const removeVisibleElement = (element: HTMLElement) => {
      const index = intersectingElements.value.indexOf(element)
      if (index !== -1) {
        intersectingElements.value.splice(index, 1)
      }
    }

    /**
     * Creates an `IntersectionObserver` to detect the first visible elements. Children of this
     * component should register themselves if they want to be observed.
     *
     * @returns The intersection observer.
     */
    const visibleElementsObserver = computed((): ScrollVisibilityObserver | null => {
      const observer = intersectionObserver.value
      return observer
        ? {
            observe: observer.observe.bind(observer),
            unobserve: element => {
              removeVisibleElement(element)
              observer.unobserve(element)
            },
          }
        : null
    })
    provide(ScrollObserverKey as string, visibleElementsObserver)

    /**
     * Updates the visible elements given a list of intersection observer entries.
     *
     * @param entries - The entries from whom update the visibility.
     */
    const updateVisibleElements = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        const target = entry.target as HTMLElement
        if (entry.isIntersecting) {
          intersectingElements.value.push(target)
        } else {
          removeVisibleElement(target)
        }
      })
    }

    /** Stores the root element and initialise the observer after mounting the component. */
    onMounted(() => {
      rootRef.value = getCurrentInstance()?.proxy?.$el
      if (rootRef.value) {
        intersectionObserver.value = new IntersectionObserver(updateVisibleElements, {
          root: props.useWindow ? document : rootRef.value,
          threshold: props.threshold,
          rootMargin: props.margin,
        })
      }
    })

    /** Disconnects the intersection observer. */
    onBeforeUnmount(() => {
      intersectionObserver.value?.disconnect()
      xBus.emit('UserScrolledToElement', '')
    })

    /** Disconnects the previous observer. */
    watch(intersectionObserver, (_new, old) => old?.disconnect())

    /** Stores the identifier of the timeout that will consider the scroll failed to restore. */
    let restoreScrollFailTimeoutId: number

    /**
     * If there is a pending scroll, starts a countdown to stop trying to restore the scroll.
     *
     * @param pendingScrollTo - The position the scroll should be restored to.
     */
    watch(pendingScrollTo, () => {
      // TODO Move this logic to the wiring. A cancelable delay operator is needed
      clearTimeout(restoreScrollFailTimeoutId)
      if (pendingScrollTo.value) {
        restoreScrollFailTimeoutId = window.setTimeout(() => {
          xBus.emit('ScrollRestoreFailed')
        }, props.restoreScrollTimeoutMs)
      }
    })

    /**
     * The first visible element contained in this component.
     *
     * @returns The first visible element in this component.
     */
    const firstVisibleElement = computed(() => {
      if (intersectingElements.value.length === 0) {
        return ''
      }
      const firstVisibleElement = intersectingElements.value.reduce(
        (firstVisibleElement, anotherElement) => {
          // FIXME: This algorithm only takes into account LTR layouts
          const firstVisibleElementBounds = firstVisibleElement.getBoundingClientRect()
          const anotherElementBounds = anotherElement.getBoundingClientRect()
          return anotherElementBounds.left <= firstVisibleElementBounds.left &&
            anotherElementBounds.top <= firstVisibleElementBounds.top
            ? anotherElement
            : firstVisibleElement
        },
      )
      return firstVisibleElement === rootRef.value?.querySelector('[data-scroll]')
        ? ''
        : firstVisibleElement.dataset.scroll!
    })

    watch(
      firstVisibleElement,
      () => xBus.emit('UserScrolledToElement', firstVisibleElement.value),
      { immediate: true },
    )

    /*
     * Obtains the vNodes array of the default slot and renders only the first one.
     * It avoids to render a `Fragment` with the vNodes in Vue3 and the same behaviour in Vue2
     * because Vue2 only allows a single root node. Then, `getCurrentInstance()?.proxy?.$el` to
     * retrieve the HTML element in both versions.
     */
    return () => slots.default?.()[0] ?? ''
  },
})
</script>

<docs lang="mdx">
## Events

This component emits the following events:

- [`UserScrolledToElement`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts)
- [`ScrollRestoreFailed`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts)

## See it in action

The `MainScroll` component must be an ancestor of the `MainScrollItem` components. This is because
it injects the needed utilities to determine the first visible item.

```vue
<template>
  <MainScroll>
    <ul>
      <MainScrollItem v-for="item in 24" :key="item" tag="li">Item {{ item }}</MainScrollItem>
    </ul>
  </MainScroll>
</template>

<script setup>
import { MainScroll, MainScrollItem } from '@empathyco/x-components/scroll'
</script>

<style scoped>
ul {
  overflow: auto;
  max-height: 200px;
}

li {
  height: 50px;
  line-height: 50px;
}
</style>
```

### Play with props

#### Window scroll

In case you aren't using a custom scrolling element like the `Scroll` panel, and want to use the
default browser scroll, you can do so by using the `useWindow` prop:

```vue
<template>
  <MainScroll useWindow>
    <ul>
      <MainScrollItem v-for="item in 24" :key="item" tag="li">Item {{ item }}</MainScrollItem>
    </ul>
  </MainScroll>
</template>

<script setup>
import { MainScroll, MainScrollItem } from '@empathyco/x-components/scroll'
</script>
```

#### Timeout for restoring scroll

When your application is loaded, this component, together with the `MainScrollItem` will try to
restore the scroll to the provided position (if available). Because of the dynamic nature of
JavaScript applications, the element that it tries to restore the scroll to might not be available
anymore. For this reason after a defined time, the scroll restoration will be considered failed.

This time can be configured through the `restore-scroll-timeout-ms` prop. This is specially useful
when combined with the URL X Module.

```vue
<template>
  <MainScroll :restoreScrollTimeoutMs="1000">
    <ul>
      <MainScrollItem v-for="item in 24" :key="item" tag="li">Item {{ item }}</MainScrollItem>
    </ul>
  </MainScroll>
</template>

<script setup>
import { MainScroll, MainScrollItem } from '@empathyco/x-components/scroll'
</script>
```

#### Adjust first visible item

By default this component will consider the first visible item, the first element that is at least
intersecting a 50% with its container. However this arbitrary number might not always be the best.

To configure this, you can use the `margin` and `threshold` props, which work exactly like in the
`IntersectionObserver` API. In this example we are reducing the bounds of the intersection by 50px,
and adjusting the element to be at least 75% intersecting.

```vue
<template>
  <MainScroll :threshold="0.75" margin="-50px">
    <ul>
      <MainScrollItem v-for="item in 24" :key="item" tag="li">Item {{ item }}</MainScrollItem>
    </ul>
  </MainScroll>
</template>

<script setup>
import { MainScroll, MainScrollItem } from '@empathyco/x-components/scroll'
</script>
```
</docs>
