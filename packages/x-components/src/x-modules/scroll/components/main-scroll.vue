<template>
  <NoElement :class="dynamicClasses">
    <slot />
  </NoElement>
</template>
<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop, Watch } from 'vue-property-decorator';
  import { XEmit } from '../../../components/decorators/bus.decorators';
  import { XProvide } from '../../../components/decorators/injection.decorators';
  import { State } from '../../../components/decorators/store.decorators';
  import { NoElement } from '../../../components/no-element';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { VueCSSClasses } from '../../../utils/index';
  import { scrollXModule } from '../x-module';
  import { DISABLE_ANIMATIONS_KEY } from '../../../components/decorators/injection.consts';
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
  @Component({
    components: { NoElement },
    mixins: [xComponentMixin(scrollXModule)]
  })
  /* eslint-disable @typescript-eslint/unbound-method */
  export default class MainScroll extends Vue {
    /**
     * If `true`, sets this scroll instance to the main of the application. Being the main
     * scroll implies that features like restoring the scroll when the query changes, or storing
     * the scroll position in the URL will be enabled for this container.
     *
     * @public
     */
    @Prop({ default: false, type: Boolean })
    public useWindow!: boolean;

    /**
     * Timeout in milliseconds to abort trying to restore the scroll position to the target
     * element.
     *
     * @public
     */
    @Prop({ default: 5000 })
    public restoreScrollTimeoutMs!: number;

    /**
     * Intersection percentage to consider an element visible.
     *
     * @public
     */
    @Prop({ default: 0.3 })
    public threshold!: number;

    /**
     * Adjusts the size of the scroll container bounds.
     *
     * @public
     */
    @Prop({ default: '0px' })
    public margin!: string;

    /**
     * The elements that are currently considered visible.
     *
     * @internal
     */
    protected intersectingElements: HTMLElement[] = [];

    /**
     * Intersection observer to determine visibility of the elements.
     *
     * @returns An intersection observer to detect elements visibility.
     * @internal
     */
    protected intersectionObserver: IntersectionObserver | null = null;

    /**
     * Stores the identifier of the timeout that will consider the scroll failed to restore.
     *
     * @internal
     */
    protected restoreScrollFailTimeoutId?: number;

    /**
     * Pending identifier scroll position to restore. If it matches the {@link MainScrollItem.item}
     * `id` property, this component should be scrolled into view.
     *
     * @internal
     */
    @State('scroll', 'pendingScrollTo')
    public pendingScrollTo!: string;

    /**
     * Disables the animations.
     *
     * @returns A boolean to disable the animations.
     * @internal
     */
    @XProvide(DISABLE_ANIMATIONS_KEY)
    public get disableAnimations(): boolean {
      return !!this.pendingScrollTo;
    }

    /**
     * Creates an `IntersectionObserver` to detect the first visible elements. Children of this
     * component should register themselves if they want to be observed.
     *
     * @returns The intersection observer.
     * @public
     */
    @XProvide(ScrollObserverKey)
    public get visibleElementsObserver(): ScrollVisibilityObserver | null {
      const observer = this.intersectionObserver;
      return observer
        ? {
            observe: observer.observe.bind(observer),
            unobserve: element => {
              this.removeVisibleElement(element);
              observer.unobserve(element);
            }
          }
        : null;
    }

    /**
     * The first visible element contained in this component.
     *
     * @returns The first visible element in this component.
     * @internal
     */
    @XEmit('UserScrolledToElement')
    public get firstVisibleElement(): string | '' {
      if (this.intersectingElements.length === 0) {
        return '';
      }
      const firstVisibleElement = this.intersectingElements.reduce(
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

      return firstVisibleElement === this.$el.querySelector('[data-scroll]')
        ? ''
        : firstVisibleElement.dataset.scroll!;
    }

    /**
     * Initialise the observer after mounting the component.
     */
    mounted(): void {
      this.intersectionObserver = new IntersectionObserver(this.updateVisibleElements, {
        root: this.useWindow ? document : this.$el,
        threshold: this.threshold,
        rootMargin: this.margin
      });
    }

    /**
     * Disconnects the intersection observer.
     *
     * @internal
     */
    beforeDestroy(): void {
      this.intersectionObserver?.disconnect();
      this.$x.emit('UserScrolledToElement', '');
    }

    /**
     * Disconnects the previous observer.
     *
     * @param _new - The new `IntersectionObserver`.
     * @param old - The new `IntersectionObserver`.
     * @internal
     */
    @Watch('intersectionObserver')
    protected disconnectPreviousObserver(
      _new: IntersectionObserver | null,
      old: IntersectionObserver | null
    ): void {
      old?.disconnect();
    }

    /**
     * If there is a pending scroll, starts a countdown to stop trying to restore the scroll.
     *
     * @param pendingScrollTo - The position the scroll should be restored to.
     * @internal
     */
    @Watch('pendingScrollTo')
    protected failRestoringScroll(pendingScrollTo: string | null): void {
      // TODO Move this logic to the wiring. A cancelable delay operator is needed
      clearTimeout(this.restoreScrollFailTimeoutId);
      if (pendingScrollTo) {
        this.restoreScrollFailTimeoutId = setTimeout(() => {
          this.$x.emit('ScrollRestoreFailed');
        }, this.restoreScrollTimeoutMs);
      }
    }

    /**
     * Removes an element from the {@link MainScroll.intersectingElements} list.
     *
     * @param element - The element to remove from the visible elements.
     * @internal
     */
    protected removeVisibleElement(element: HTMLElement): void {
      const index = this.intersectingElements.indexOf(element);
      if (index !== -1) {
        this.intersectingElements.splice(index, 1);
      }
    }

    /**
     * Updates the visible elements given a list of intersection observer entries.
     *
     * @param entries - The entries from whom update the visibility.
     * @internal
     */
    protected updateVisibleElements(entries: IntersectionObserverEntry[]): void {
      entries.forEach(entry => {
        const target = entry.target as HTMLElement;
        if (entry.isIntersecting) {
          this.intersectingElements.push(target);
        } else {
          this.removeVisibleElement(target);
        }
      });
    }

    /**
     * Adds the dynamic css classes to the component.
     *
     * @returns The class to be added to the component.
     *
     * @internal
     */
    protected get dynamicClasses(): VueCSSClasses {
      return {
        'x-main-scroll--no-transition': !!this.pendingScrollTo
      };
    }
  }
</script>

<docs lang="mdx">
## Events

This component emits the following events:

[`UserScrolledToElement`](./../../api/x-components.scrollxevents.md)
[`ScrollRestoreFailed`](./../../api/x-components.scrollxevents.md)

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
