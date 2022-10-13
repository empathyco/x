<template>
  <div v-if="$slots.default" class="x-sliding-panel" :class="cssClasses" data-test="sliding-panel">
    <button
      v-if="showButtons"
      @click="scrollLeft"
      class="x-sliding-panel__button x-sliding-panel__button-left x-button"
      :class="buttonClass"
      data-test="sliding-panel-left-button"
    >
      <!-- @slot Left button content -->
      <slot name="sliding-panel-left-button">ᐸ</slot>
    </button>
    <div
      ref="scrollContainer"
      @scroll="debouncedUpdateScrollPosition"
      @transitionend="debouncedUpdateScrollPosition"
      @animationend="debouncedUpdateScrollPosition"
      class="x-list x-list--horizontal x-sliding-panel__scroll"
      data-test="sliding-panel-scroll"
    >
      <!-- @slot (Required) Sliding panel content -->
      <slot />
    </div>
    <button
      v-if="showButtons"
      @click="scrollRight"
      class="x-sliding-panel__button x-sliding-panel__button-right x-button"
      :class="buttonClass"
      data-test="sliding-panel-right-button"
    >
      <!-- @slot Right button content -->
      <slot name="sliding-panel-right-button">ᐳ</slot>
    </button>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { VueCSSClasses } from '../utils/types';
  import { Debounce } from './decorators/debounce.decorators';

  /**
   * This component allows for any other component or element inside it to be horizontally
   * navigable. It also implements customizable buttons as well as other minor customizations to its
   * general behavior.
   *
   * @public
   */
  @Component
  export default class SlidingPanel extends Vue {
    /**
     * Scroll factor that will dictate how much the scroll moves when pressing a navigation button.
     *
     * @public
     */
    @Prop({ default: 0.7 })
    public scrollFactor!: number;

    /**
     * Would make the navigation buttons visible when they're needed or always hide them.
     *
     * @public
     */
    @Prop({ default: true })
    public showButtons!: boolean;

    /**
     * When true, whenever the DOM content in the sliding panel slot changes, it will reset
     * the scroll position to 0.
     *
     * @public
     */
    @Prop({ default: true })
    public resetOnContentChange!: boolean;

    /**
     * CSS classes to add to the buttons.
     *
     * @public
     */
    @Prop()
    public buttonClass?: string;

    /**
     * Indicates if the scroll is at the start of the sliding panel.
     *
     * @internal
     */
    protected isScrollAtStart = true;

    /**
     * Indicates if the scroll is at the end of the sliding panel.
     *
     * @internal
     */
    protected isScrollAtEnd = true;

    /**
     * HTMLElement referencing the scroll of the component.
     *
     * @internal
     */
    public $refs!: {
      scrollContainer: HTMLElement;
    };

    /**
     * CSS classes to apply based on the scroll position.
     *
     * @returns The CSS classes to apply.
     *
     * @internal
     */
    protected get cssClasses(): VueCSSClasses {
      return {
        'x-sliding-panel--at-start': this.isScrollAtStart,
        'x-sliding-panel--at-end': this.isScrollAtEnd
      };
    }

    /**
     * Initialises browser platform code:
     * - Creates a mutation observer to detect content changes and reset scroll position.
     * - Stores initial size and scroll position values.
     *
     * @internal
     */
    mounted(): void {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      const resizeObserver = new ResizeObserver(this.debouncedUpdateScrollPosition);
      resizeObserver.observe(this.$el);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      const contentChangedObserver = new MutationObserver(this.restoreAndUpdateScroll);
      this.$watch(
        () => this.resetOnContentChange,
        shouldReset => {
          if (shouldReset) {
            contentChangedObserver.observe(this.$refs.scrollContainer, {
              attributes: false,
              childList: true,
              subtree: true,
              characterData: false
            });
          } else {
            contentChangedObserver.disconnect();
          }
        },
        { immediate: true }
      );
      this.$on('hook:beforeDestroy', () => {
        contentChangedObserver.disconnect();
        resizeObserver.disconnect();
      });

      this.updateScrollPosition();
    }

    /**
     * Resets the scroll and updates the values of the scroll for the buttons to react.
     *
     * @internal
     */
    @Debounce(100, { leading: true })
    restoreAndUpdateScroll(): void {
      this.$refs.scrollContainer.scroll({ left: 0, behavior: 'smooth' });
      this.updateScrollPosition();
    }

    /**
     * Updates the values of the scroll positions to show or hide the buttons depending on it.
     *
     * @internal
     */
    protected updateScrollPosition(): void {
      if (this.$refs.scrollContainer !== undefined) {
        const { scrollLeft, clientWidth, scrollWidth } = this.$refs.scrollContainer;
        this.isScrollAtStart = !scrollLeft;
        /* The 2 px extra is to fix some cases in some resolutions where the scroll + client size is
         *  less than the scroll width even when the scroll is at the end */
        this.isScrollAtEnd = scrollLeft + clientWidth + 2 >= scrollWidth;
      }
    }

    /**
     * Debounced version of the {@link SlidingPanel.updateScrollPosition | updateScrollPosition}
     * method.
     *
     * @internal
     */
    @Debounce(100, { leading: true })
    debouncedUpdateScrollPosition(): void {
      this.updateScrollPosition();
    }

    /**
     * Scrolls the wrapper element to the left.
     *
     * @internal
     */
    protected scrollLeft(): void {
      this.scrollTo(-this.$refs.scrollContainer.clientWidth);
    }

    /**
     * Scrolls the wrapper element to the right.
     *
     * @internal
     */
    protected scrollRight(): void {
      this.scrollTo(this.$refs.scrollContainer.clientWidth);
    }

    /**
     * Scrolls the wrapper element towards the provided scroll value.
     *
     * @param scrollValue - The value the scroll will go towards.
     *
     * @internal
     */
    protected scrollTo(scrollValue: number): void {
      this.$refs.scrollContainer.scrollBy({
        left: scrollValue * this.scrollFactor,
        behavior: 'smooth'
      });
    }
  }
</script>

<style lang="scss" scoped>
  .x-sliding-panel {
    align-items: center;
    display: flex;
    flex-flow: row nowrap;
    height: 100%;
    position: relative;

    &__button {
      opacity: 0;
      pointer-events: none;
      position: absolute;
      transition: all ease-out 0.2s;
      z-index: 2; /* To overlay the design system gradient with z-index:1 */

      &-left {
        left: 0;
      }

      &-right {
        right: 0;
      }
    }

    &__scroll {
      display: flex;
      flex: 100%;
      flex-flow: row nowrap;
      overflow-x: auto;
      overflow-y: hidden;
      scrollbar-width: none; // Firefox
      -ms-overflow-style: none; // IE

      // Chrome, Edge & Safari
      &::-webkit-scrollbar {
        display: none;
      }
    }

    &:not(.x-sliding-panel--show-buttons-on-hover):not(.x-sliding-panel--at-start) {
      .x-sliding-panel__button-left {
        opacity: 1;
        pointer-events: all;
      }
    }

    &:not(.x-sliding-panel--show-buttons-on-hover):not(.x-sliding-panel--at-end) {
      .x-sliding-panel__button-right {
        opacity: 1;
        pointer-events: all;
      }
    }
  }
</style>

<docs lang="mdx">
## Events

This component emits no events.

## See it in action

Simplest implementation of the component, just a list-based component inside its slot.

```vue
<template>
  <SlidingPanel>
    <div class="item">Item 1</div>
    <div class="item">Item 2</div>
    <div class="item">Item 3</div>
    <div class="item">Item 4</div>
  </SlidingPanel>
</template>

<script>
  import { SlidingPanel } from '@empathyco/x-components';

  export default {
    name: 'SlidingPanelDemo',
    components: {
      SlidingPanel
    }
  };
</script>

<style>
  .x-sliding-panel {
    width: 200px;
  }

  .item {
    display: inline-block;
    width: 100px;
  }
</style>
```

### Play with props

#### Modifying scroll buttons travel distance

Edit how much the scroll travels when navigating with the buttons by changing the `scrollFactor`
prop.

```vue
<template>
  <SlidingPanel :scrollFactor="1.5">
    <div class="item">Item 1</div>
    <div class="item">Item 2</div>
    <div class="item">Item 3</div>
    <div class="item">Item 4</div>
  </SlidingPanel>
</template>

<script>
  import { SlidingPanel } from '@empathyco/x-components';

  export default {
    name: 'SlidingPanelDemo',
    components: {
      SlidingPanel
    }
  };
</script>

<style>
  .x-sliding-panel {
    width: 200px;
  }

  .item {
    display: inline-block;
    width: 100px;
  }
</style>
```

#### Hiding scroll buttons

Hide the navigational buttons completely by setting the `showButtons` prop to `false`. This is
intended to be used when other scrolling options are available, like in mobile, where you can scroll
just by swiping.

```vue
<template>
  <SlidingPanel :showButtons="false">
    <div class="item">Item 1</div>
    <div class="item">Item 2</div>
    <div class="item">Item 3</div>
    <div class="item">Item 4</div>
  </SlidingPanel>
</template>

<script>
  import { SlidingPanel } from '@empathyco/x-components';

  export default {
    name: 'SlidingPanelDemo',
    components: {
      SlidingPanel
    }
  };
</script>

<style>
  .x-sliding-panel {
    width: 200px;
  }

  .item {
    display: inline-block;
    width: 100px;
  }
</style>
```

#### Disabling reset the scroll when content changes

By default, whenever the content of the sliding panel changes, it auto resets its scroll position.
You can disable this behavior setting the `resetOnContentChange` prop to `false`.

```vue
<template>
  <div>
    <button @click="items++">Add item</button>
    <label>
      <input type="checkbox" v-model="resetOnContentChange" />
      Reset content onchange
    </label>
    <SlidingPanel :resetOnContentChange="resetOnContentChange">
      <div class="item" v-for="item in items" :key="item">Item {{ item }}</div>
    </SlidingPanel>
  </div>
</template>

<script>
  import { SlidingPanel } from '@empathyco/x-components';

  export default {
    name: 'SlidingPanelDemo',
    components: {
      SlidingPanel
    },
    data() {
      return {
        items: 4,
        resetOnContentChange: false
      };
    }
  };
</script>

<style>
  .x-sliding-panel {
    width: 200px;
  }

  .item {
    display: inline-block;
    width: 100px;
  }
</style>
```

## Extending the component

### Overriding Button content

By default the buttons show an arrow depicting the direction the scroll would go to when clicked,
but this content can be customized with anything, from characters to SVG and images.

```vue
<template>
  <SlidingPanel>
    <template #sliding-panel-left-button>Left</template>
    <template #default>
      <div class="item">Item 1</div>
      <div class="item">Item 2</div>
      <div class="item">Item 3</div>
      <div class="item">Item 4</div>
    </template>
    <template #sliding-panel-right-button>Right</template>
  </SlidingPanel>
</template>

<script>
  import { SlidingPanel } from '@empathyco/x-components';

  export default {
    name: 'SlidingPanelDemo',
    components: {
      SlidingPanel
    }
  };
</script>

<style>
  .x-sliding-panel {
    width: 200px;
  }

  .item {
    display: inline-block;
    width: 100px;
  }
</style>
```
</docs>
