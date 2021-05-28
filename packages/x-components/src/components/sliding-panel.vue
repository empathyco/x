<template>
  <div v-if="$slots.default" class="x-sliding-panel" :class="cssClasses" data-test="sliding-panel">
    <button
      v-if="showButtons"
      @click="scrollLeft"
      class="x-sliding-panel__button x-sliding-panel__button-left x-button x-button--round"
      data-test="sliding-panel-left-button"
    >
      <!-- @slot Left button content -->
      <slot name="sliding-panel-left-button">←</slot>
    </button>
    <div
      ref="scrollContainer"
      @scroll="debouncedUpdateScrollPosition"
      @transitionend="debouncedUpdateScrollPosition"
      @animationend="debouncedUpdateScrollPosition"
      class="x-sliding-panel__scroll"
      data-test="sliding-panel-scroll"
    >
      <!-- @slot (Required) Sliding panel content -->
      <slot />
    </div>
    <button
      v-if="showButtons"
      @click="scrollRight"
      class="x-sliding-panel__button x-sliding-panel__button-right x-button x-button--round"
      data-test="sliding-panel-right-button"
    >
      <!-- @slot Right button content -->
      <slot name="sliding-panel-right-button">→</slot>
    </button>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { VueCSSClasses } from '../utils/types';
  import { Debounce } from './decorators/debounce.decorators';

  /**
   * Horizontal slide panel component. The content that is provided to this component would be
   * navigable horizontally using two navigational buttons.
   *
   * @public
   */
  @Component
  export default class SlidingPanel extends Vue {
    /**
     * Scroll factor that will dictate how much the scroll moves when pressing a navigation button.
     */
    @Prop({ default: 0.7 })
    protected scrollFactor!: number;

    /**
     * Would make the navigation buttons visible when they're needed or always hide them.
     */
    @Prop({ default: true })
    protected showButtons!: boolean;

    /**
     * MutationObserver that watches for changes inside the wrapping div to update
     * the scroll position.
     */
    protected scrollObserver = new MutationObserver(
      // eslint-disable-next-line @typescript-eslint/unbound-method
      this.restoreAndUpdateScroll
    );

    /**
     * Indicates if the scroll is at the start of the sliding panel.
     */
    protected isScrollAtStart = true;

    /**
     * Indicates if the scroll is at the end of the sliding panel.
     */
    protected isScrollAtEnd = true;

    /**
     * HTMLElement referencing the scroll of the component.
     */
    public $refs!: {
      scrollContainer: HTMLElement;
    };

    mounted(): void {
      this.scrollObserver.observe(this.$refs.scrollContainer, {
        attributes: false,
        childList: true,
        subtree: true,
        characterData: false
      });
      // eslint-disable-next-line @typescript-eslint/unbound-method
      window?.addEventListener('resize', this.debouncedUpdateScrollPosition);

      this.updateScrollPosition();
    }

    beforeDestroy(): void {
      this.scrollObserver.disconnect();
      // eslint-disable-next-line @typescript-eslint/unbound-method
      window?.removeEventListener('resize', this.debouncedUpdateScrollPosition);
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
      const { scrollLeft, clientWidth, scrollWidth } = this.$refs.scrollContainer;
      this.isScrollAtStart = !scrollLeft;
      /* The 2 px extra is to fix some cases in some resolutions where the scroll + client size is
       *  less than the scroll width even when the scroll is at the end */
      this.isScrollAtEnd = scrollLeft + clientWidth + 2 >= scrollWidth;
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
     * @remarks this function uses the scrollBy from Element and it's not available in all browsers.
     *
     * @internal
     */
    protected scrollTo(scrollValue: number): void {
      this.$refs.scrollContainer.scrollBy({
        left: scrollValue * this.scrollFactor,
        behavior: 'smooth'
      });
    }

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
      position: absolute;
      transition: all ease-out 0.2s;
      z-index: 1;

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
      overflow: auto;
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
      }
    }
    &:not(.x-sliding-panel--show-buttons-on-hover):not(.x-sliding-panel--at-end) {
      .x-sliding-panel__button-right {
        opacity: 1;
      }
    }
  }
</style>

<docs>
#Example

This component allows for any other component or element inside it to be horizontally navigable.
It also implements customizable buttons as well as other minor customizations to its
general behavior.
The component uses the method `scrollBy` from `Element` to function, and it doesn't work properly
in all browsers. A polyfill for the `scrollBy` would be needed for the component to behave as
expected in those browsers.

## Default usage

Simplest implementation of the component, just a list-based component inside its slot.

```vue
<SlidingPanel>
  <RelatedTags />
</SlidingPanel>
```

## Behavior customization

Edit how much the scroll travels when navigating with the buttons by changing the `scrollFactor`.

```vue
<SlidingPanel :scrollFactor="1.2">
  <RelatedTags />
</SlidingPanel>
```

Hide the navigational buttons completely by setting the `showButtons` prop to `false`. This is
intended to be used when other scrolling options are available, like in mobile, where you can
scroll just by swiping.

```vue
<SlidingPanel :showButtons="isMobile">
  <RelatedTags />
</SlidingPanel>
```

## Overriding Button content

By default the buttons show an arrow depicting the direction the scroll would go to when clicked,
but this content can be customized with anything, from characters to SVG and images.

```vue
<SlidingPanel>
  <template #sliding-panel-left-button>
    Left
  </template>
  <RelatedTags />
  <template #sliding-panel-right-button>
    Right
  </template>
</SlidingPanel>
```
</docs>
