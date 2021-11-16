<template>
  <component :is="tag" :data-scroll="item.id">
    <slot />
  </component>
</template>
<script lang="ts">
  import { Identifiable } from '@empathyco/x-types';
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { State, xComponentMixin } from '../../../components';
  import { XInject } from '../../../components/decorators/injection.decorators';
  import { NoElement } from '../../../components/no-element';
  import UrlHandler from '../../url/components/url-handler.vue';
  import { scrollXModule } from '../x-module';
  import MainScroll from './main-scroll.vue';
  import { FirstVisibleItemObserverKey } from './scroll.const';
  import { ScrollVisibilityObserver } from './scroll.types';

  /**
   * Wrapper for elements contained in the {@link MainScroll} that should store/restore its
   * position.
   *
   * @public
   */
  @Component({
    mixins: [xComponentMixin(scrollXModule)],
    components: { UrlHandler, MainScroll, NoElement }
  })
  export default class MainScrollItem extends Vue {
    /**
     * Rendered HTML node.
     *
     * @public
     */
    public $el!: HTMLElement;

    /**
     * The item data. Used to set the scroll identifier.
     *
     * @public
     */
    @Prop({ required: true })
    public item!: Identifiable;

    /**
     * The tag to render.
     *
     * @public
     */
    @Prop({ default: 'NoElement' })
    public tag!: string;

    /**
     * Pending identifier scroll position to restore. If it matches the {@link MainScrollItem.item}
     * `id` property, this component should be scrolled into view.
     *
     * @internal
     */
    @State('scroll', 'pendingScrollTo')
    public pendingScrollTo!: string;

    /**
     * Observer to detect the first visible element.
     *
     * @internal
     */
    @XInject(FirstVisibleItemObserverKey)
    public firstVisibleItemObserver!: ScrollVisibilityObserver | null;

    /**
     * Initialise scroll behavior.
     * - Observes the rendered element to detect if it is the first visible item.
     * - If the rendered element matches the {@link MainScrollItem.pendingScrollTo}, scrolls the
     * element into the first position of the view.
     *
     * @internal
     */
    async mounted(): Promise<void> {
      await this.$nextTick(); // Mounted does not guarantee that child components are mounted too
      // eslint-disable-next-line @typescript-eslint/unbound-method
      this.$watch('firstVisibleItemObserver', this.observeItem, { immediate: true });
    }

    /**
     * Detaches the observer from the rendered element to prevent memory leaks.
     *
     * @internal
     */
    beforeDestroy(): void {
      this.firstVisibleItemObserver?.unobserve(this.$el);
    }

    /**
     * Initialises the element visibility observation, stopping the previous one if it has.
     *
     * @param newObserver - The new observer for the HTML element.
     * @param oldObserver - The old observer for the HTML element.
     */
    observeItem(
      newObserver: ScrollVisibilityObserver | null,
      oldObserver: ScrollVisibilityObserver | null
    ): void {
      oldObserver?.unobserve(this.$el);
      newObserver?.observe(this.$el);
      if (this.pendingScrollTo === this.item.id) {
        this.$el.scrollIntoView();
        this.$x.emit('ScrollRestoreSucceeded');
      }
    }
  }
</script>

<docs lang="mdx">
## Events

This components emits the following events:

- [`ScrollRestored`](./../../api/x-components.xeventstypes.md)

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
          <MainScrollItem :item="item">
            <img :src="item.images[0]" />
            <p>{{ item.title }}</p>
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
