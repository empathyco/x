<template>
  <component :is="tag" ref="el" v-on="$listeners" :data-scroll="item.id">
    <slot />
  </component>
</template>
<script lang="ts">
  import { Identifiable } from '@empathyco/x-types';
  import Vue, { defineComponent, nextTick, PropType, ref } from 'vue';
  import { NoElement } from '../../../components';
  import { scrollXModule } from '../x-module';
  import { useState, useHybridInject, useRegisterXModule } from '../../../composables';
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
      useRegisterXModule(scrollXModule);
      const xBus = useXBus();

      /**
       * Rendered HTML node.
       *
       * @public
       */
      const el = ref<any>(null);

      /**
       * Pending identifier scroll position to restore. If it matches the {@link MainScrollItem} item
       * `id` property, this component should be scrolled into view.
       *
       * @internal
       */
      const pendingScrollTo: string = useState('scroll', ['pendingScrollTo']).pendingScrollTo.value;

      /**
       * Observer to detect the first visible element.
       *
       * @internal
       */
      const firstVisibleItemObserver = useHybridInject<ScrollVisibilityObserver>(
        ScrollObserverKey as string
      ) as ScrollVisibilityObserver;

      /**
       * Initialises the element visibility observation, stopping the previous one if it has.
       *
       * @param newObserver - The new observer for the HTML element.
       * @param oldObserver - The old observer for the HTML element.
       */
      const observeItem = (
        newObserver: ScrollVisibilityObserver | null,
        oldObserver: ScrollVisibilityObserver | null
      ): void => {
        {
          if (el.value !== null) {
            oldObserver?.unobserve(el.value.$el);
            newObserver?.observe(el.value.$el);
            if (pendingScrollTo === props.item.id) {
              Vue.nextTick(() => {
                el.value?.$el.scrollIntoView({
                  block: 'center'
                });
              });
              xBus.emit('ScrollRestoreSucceeded');
            }
          }
        }
      };

      return { el, firstVisibleItemObserver, observeItem };
    },

    /**
     * Initialise scroll behavior.
     * - Observes the rendered element to detect if it is the first visible item.
     * - If the rendered element matches the {@link MainScrollItem.pendingScrollTo}, scrolls the
     * element into the first position of the view.
     *
     * @internal
     */
    mounted() {
      nextTick(() => {
        // Mounted does not guarantee that child components are mounted too
        // eslint-disable-next-line @typescript-eslint/unbound-method
        this.$watch('firstVisibleItemObserver', this.observeItem, { immediate: true });
      });
    },

    /**
     * Detaches the observer from the rendered element to prevent memory leaks.
     *
     * @internal
     */
    beforeDestroy() {
      if (this.el !== null) {
        this.firstVisibleItemObserver?.unobserve(this.el.$el);
      }
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
