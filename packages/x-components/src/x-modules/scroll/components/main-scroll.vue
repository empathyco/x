<template>
  <div ref="rootRef" :class="dynamicClasses">
    <slot />
  </div>
</template>
<script lang="ts">
  import { computed, defineComponent, onBeforeUnmount, onMounted, provide, ref, watch } from 'vue';
  import { VueCSSClasses } from '../../../utils/types';
  import { scrollXModule } from '../x-module';
  import { DISABLE_ANIMATIONS_KEY } from '../../../components/decorators/injection.consts';
  import { useRegisterXModule } from '../../../composables/use-register-x-module';
  import { useState } from '../../../composables/use-state';
  import { useXBus } from '../../../composables/use-x-bus';
  import { ScrollObserverKey } from './scroll.const';
  import { ScrollVisibilityObserver } from './scroll.types';

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
    props: {
      /**
       * If `true`, sets this scroll instance to the main of the application. Being the main
       * scroll implies that features like restoring the scroll when the query changes, or storing
       * the scroll position in the URL will be enabled for this container.
       *
       * @public
       */
      useWindow: {
        type: Boolean,
        default: false
      },
      /**
       * Timeout in milliseconds to abort trying to restore the scroll position to the target
       * element.
       *
       * @public
       */
      restoreScrollTimeoutMs: {
        type: Number,
        default: 5000
      },
      /**
       * Intersection percentage to consider an element visible.
       *
       * @public
       */
      threshold: {
        type: Number,
        default: 0.3
      },
      /**
       * Adjusts the size of the scroll container bounds.
       *
       * @public
       */
      margin: {
        type: String,
        default: '0px'
      }
    },
    setup(props) {
      useRegisterXModule(scrollXModule);

      const xBus = useXBus();

      /**
       * The elements that are currently considered visible.
       *
       * @internal
       */
      const intersectingElements = ref<HTMLElement[]>([]);
      /**
       * The reference to the root element of the component.
       *
       * @internal
       */
      const rootRef = ref<HTMLDivElement | null>(null);

      /**
       * Intersection observer to determine visibility of the elements.
       *
       * @returns An intersection observer to detect elements visibility.
       * @internal
       */
      let intersectionObserver = ref<IntersectionObserver | null>(null);

      /**
       * Pending identifier scroll position to restore. If it matches the {@link MainScrollItem} item
       * `id` property, this component should be scrolled into view.
       *
       * @internal
       */
      const { pendingScrollTo } = useState('scroll', ['pendingScrollTo']);

      /**
       * Disables the animations.
       *
       * @returns A boolean to disable the animations.
       * @internal
       */
      const disableAnimations = computed((): boolean => !!pendingScrollTo.value);
      provide(DISABLE_ANIMATIONS_KEY as string, disableAnimations);

      /**
       * Removes an element from the {@link MainScroll.intersectingElements} list.
       *
       * @param element - The element to remove from the visible elements.
       * @internal
       */
      const removeVisibleElement = (element: HTMLElement): void => {
        const index = intersectingElements.value.indexOf(element);
        if (index !== -1) {
          intersectingElements.value.splice(index, 1);
        }
      };

      /**
       * Creates an `IntersectionObserver` to detect the first visible elements. Children of this
       * component should register themselves if they want to be observed.
       *
       * @returns The intersection observer.
       * @public
       */
      const visibleElementsObserver = computed((): ScrollVisibilityObserver | null => {
        const observer = intersectionObserver.value;
        return observer
          ? {
              observe: observer.observe.bind(observer),
              unobserve: element => {
                removeVisibleElement(element);
                observer.unobserve(element);
              }
            }
          : null;
      });
      provide(ScrollObserverKey as string, visibleElementsObserver);

      /**
       * Updates the visible elements given a list of intersection observer entries.
       *
       * @param entries - The entries from whom update the visibility.
       * @internal
       */
      const updateVisibleElements = (entries: IntersectionObserverEntry[]): void => {
        entries.forEach(entry => {
          const target = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            intersectingElements.value.push(target);
          } else {
            removeVisibleElement(target);
          }
        });
      };

      /**
       * Initialise the observer after mounting the component.
       */
      onMounted(() => {
        intersectionObserver.value = new IntersectionObserver(updateVisibleElements, {
          root: props.useWindow ? document : rootRef.value,
          threshold: props.threshold,
          rootMargin: props.margin
        });
      });

      /**
       * Disconnects the intersection observer.
       *
       * @internal
       */
      onBeforeUnmount(() => {
        intersectionObserver.value?.disconnect();
        xBus.emit('UserScrolledToElement', '');
      });

      /**
       * Disconnects the previous observer.
       *
       * @param _new - The new `IntersectionObserver`.
       * @param old - The new `IntersectionObserver`.
       * @internal
       */
      watch(
        intersectionObserver,
        (_new: IntersectionObserver | null, old: IntersectionObserver | null) => {
          old?.disconnect();
        }
      );

      /**
       * Stores the identifier of the timeout that will consider the scroll failed to restore.
       *
       * @internal
       */
      let restoreScrollFailTimeoutId: number;

      /**
       * If there is a pending scroll, starts a countdown to stop trying to restore the scroll.
       *
       * @param pendingScrollTo - The position the scroll should be restored to.
       * @internal
       */
      watch(pendingScrollTo, () => {
        // TODO Move this logic to the wiring. A cancelable delay operator is needed
        clearTimeout(restoreScrollFailTimeoutId);
        if (pendingScrollTo.value) {
          restoreScrollFailTimeoutId = window.setTimeout(() => {
            xBus.emit('ScrollRestoreFailed');
          }, props.restoreScrollTimeoutMs);
        }
      });

      /**
       * Adds the dynamic css classes to the component.
       *
       * @returns The class to be added to the component.
       *
       * @internal
       */
      const dynamicClasses = computed((): VueCSSClasses => {
        return {
          'x-main-scroll--no-transition': !!pendingScrollTo.value
        };
      });

      /**
       * The first visible element contained in this component.
       *
       * @returns The first visible element in this component.
       * @internal
       */
      const firstVisibleElement = computed((): string | '' => {
        if (intersectingElements.value.length === 0) {
          return '';
        }
        const firstVisibleElement = intersectingElements.value.reduce(
          (firstVisibleElement, anotherElement) => {
            // FIXME: This algorithm only takes into account LTR layouts
            const firstVisibleElementBounds = firstVisibleElement.getBoundingClientRect();
            const anotherElementBounds = anotherElement.getBoundingClientRect();
            return anotherElementBounds.left <= firstVisibleElementBounds.left &&
              anotherElementBounds.top <= firstVisibleElementBounds.top
              ? anotherElement
              : firstVisibleElement;
          }
        );
        return firstVisibleElement === rootRef.value?.querySelector('[data-scroll]')
          ? ''
          : firstVisibleElement.dataset.scroll!;
      });
      watch(
        firstVisibleElement,
        () => {
          xBus.emit('UserScrolledToElement', firstVisibleElement.value);
        },
        { immediate: true }
      );

      return {
        rootRef,
        dynamicClasses,
        firstVisibleElement,
        visibleElementsObserver,
        intersectingElements
      };
    }
  });
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
      <MainScrollItem v-for="item in 24" tag="li">Item {{ item }}</MainScrollItem>
    </ul>
  </MainScroll>
</template>

<script>
  import { MainScroll, MainScrollItem } from '@empathyco/x-components/scroll';

  export default {
    name: 'MainScrollDemo',
    components: {
      MainScroll,
      MainScrollItem
    }
  };
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
      <MainScrollItem v-for="item in 24" tag="li">Item {{ item }}</MainScrollItem>
    </ul>
  </MainScroll>
</template>

<script>
  import { MainScroll, MainScrollItem } from '@empathyco/x-components/scroll';

  export default {
    name: 'MainScrollDemo',
    components: {
      MainScroll,
      MainScrollItem
    }
  };
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
      <MainScrollItem v-for="item in 24" tag="li">Item {{ item }}</MainScrollItem>
    </ul>
  </MainScroll>
</template>

<script>
  import { MainScroll, MainScrollItem } from '@empathyco/x-components/scroll';

  export default {
    name: 'MainScrollDemo',
    components: {
      MainScroll,
      MainScrollItem
    }
  };
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
      <MainScrollItem v-for="item in 24" tag="li">Item {{ item }}</MainScrollItem>
    </ul>
  </MainScroll>
</template>

<script>
  import { MainScroll, MainScrollItem } from '@empathyco/x-components/scroll';

  export default {
    name: 'MainScrollDemo',
    components: {
      MainScroll,
      MainScrollItem
    }
  };
</script>
```
</docs>
