<template>
  <component :is="tag" ref="rootRef" v-on="$listeners" :data-scroll="item.id">
    <slot />
  </component>
</template>
<script lang="ts">
  import { Identifiable } from '@empathyco/x-types';
  import Vue, {
    defineComponent,
    inject,
    nextTick,
    onBeforeUnmount,
    onMounted,
    PropType,
    ref,
    watch,
    Ref,
    WatchCallback
  } from 'vue';
  import { NoElement } from '../../../components/no-element';
  import { scrollXModule } from '../x-module';
  import { useState } from '../../../composables/use-state';
  import { useRegisterXModule } from '../../../composables/use-register-x-module';
  import { useXBus } from '../../../composables/use-x-bus';
  import { ScrollObserverKey } from './scroll.const';
  import { ScrollVisibilityObserver } from './scroll.types';

  /**
   * Wrapper for elements contained in the {@link MainScroll} that should store/restore its
   * position.
   *
   * @public
   */
  export default defineComponent({
    name: 'MainScrollItem',
    props: {
      /**
       * The item data. Used to set the scroll identifier.
       *
       * @public
       */
      item: {
        type: Object as PropType<Identifiable>,
        required: true
      },

      /**
       * The tag to render.
       *
       * @public
       */
      tag: {
        type: [String, Object] as PropType<string | typeof Vue>,
        default: () => NoElement
      }
    },

    setup(props) {
      type ElementRef = {
        $el: HTMLElement;
      };

      useRegisterXModule(scrollXModule);
      const xBus = useXBus();

      /**
       * Rendered HTML node.
       *
       * @public
       */
      const rootRef = ref<ElementRef | HTMLElement | null>(null);

      /**
       * Pending identifier scroll position to restore. If it matches the {@link MainScrollItem} item
       * `id` property, this component should be scrolled into view.
       *
       * @internal
       */
      const { pendingScrollTo } = useState('scroll', ['pendingScrollTo']);

      /**
       * Observer to detect the first visible element.
       *
       * @internal
       */
      const firstVisibleItemObserver = inject<Ref<ScrollVisibilityObserver> | null>(
        ScrollObserverKey as string,
        null
      );
      /**
       * Checks if a given value is an `ElementRef` object.
       *
       * @param value - The value to check.
       * @returns `true` if the value is an `ElementRef` object, `false` otherwise.
       *
       * @internal
       */
      const isElementRef = (value: any): value is ElementRef => {
        return value && value.$el instanceof HTMLElement;
      };
      /**
       * Initialises the element visibility observation, stopping the previous one if it has.
       *
       * @param newObserver - The new observer for the HTML element.
       * @param oldObserver - The old observer for the HTML element.
       */
      const observeItem: WatchCallback<ScrollVisibilityObserver> = (
        newObserver: ScrollVisibilityObserver | null,
        oldObserver: ScrollVisibilityObserver | null
      ): void => {
        {
          if (rootRef.value !== null) {
            const htmlElement = isElementRef(rootRef.value) ? rootRef.value.$el : rootRef.value;

            oldObserver?.unobserve(htmlElement);
            newObserver?.observe(htmlElement);
            if (pendingScrollTo.value === props.item.id) {
              Vue.nextTick(() => {
                htmlElement.scrollIntoView({
                  block: 'center'
                });
              });
              xBus.emit('ScrollRestoreSucceeded');
            }
          }
        }
      };

      /**
       * Detaches the observer from the rendered element to prevent memory leaks.
       *
       * @internal
       */
      onBeforeUnmount(() => {
        if (rootRef.value !== null) {
          const htmlElement = isElementRef(rootRef.value) ? rootRef.value.$el : rootRef.value;
          firstVisibleItemObserver?.value.unobserve(htmlElement);
        }
      });

      /**
       * Initialise scroll behavior.
       * - Observes the rendered element to detect if it is the first visible item.
       * - If the rendered element matches the {@link MainScrollItem.pendingScrollTo}, scrolls the
       * element into the first position of the view.
       *
       * @internal
       */
      onMounted(() => {
        nextTick(() => {
          // Mounted does not guarantee that child components are mounted too
          if (firstVisibleItemObserver) {
            watch(firstVisibleItemObserver, observeItem, { immediate: true });
          }
        });
      });

      return { rootRef, firstVisibleItemObserver, observeItem, isElementRef };
    }
  });
</script>

<docs lang="mdx">
## Events

This components emits the following events:

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

<script>
  import { MainScroll, Scroll, MainScrollItem } from '@empathyco/x-components/scroll';
  import { ResultsList } from '@empathyco/x-components/search';
  import { SearchInput } from '@empathyco/x-components/search-box';
  import { UrlHandler } from '@empathyco/x-components/url';

  export default {
    name: 'ScrollItemDemo',
    components: {
      Scroll,
      ResultsList,
      MainScroll,
      MainScrollItem,
      SearchInput,
      UrlHandler
    }
  };
</script>
```
</docs>
