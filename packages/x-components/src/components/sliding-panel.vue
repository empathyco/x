<template>
  <div v-if="slots.default" class="x-sliding-panel" :class="cssClasses" data-test="sliding-panel">
    <button
      v-if="showButtons"
      @click="scrollLeft"
      class="x-sliding-panel__button x-button x-sliding-panel-button-left"
      :class="buttonClass"
      data-test="sliding-panel-left-button"
    >
      <!-- @slot Left button content -->
      <slot name="sliding-panel-left-button">ᐸ</slot>
    </button>
    <div
      ref="scrollContainerRef"
      @scroll="debouncedUpdateScroll"
      @transitionend="debouncedUpdateScroll"
      @animationend="debouncedUpdateScroll"
      :class="scrollContainerClass"
      class="x-sliding-panel__scroll"
      data-test="sliding-panel-scroll"
    >
      <!-- @slot (Required) Sliding panel content -->
      <slot />
    </div>
    <button
      v-if="showButtons"
      @click="scrollRight"
      class="x-sliding-panel__button x-button x-sliding-panel-button-right"
      :class="buttonClass"
      data-test="sliding-panel-right-button"
    >
      <!-- @slot Right button content -->
      <slot name="sliding-panel-right-button">ᐳ</slot>
    </button>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, onBeforeUnmount, onMounted, PropType, ref, watch } from 'vue';
  import { useDebounce } from '../composables/use-debounce';
  import { VueCSSClasses } from '../utils/types';

  /**
   * This component allows for any other component or element inside it to be horizontally
   * navigable. It also implements customizable buttons as well as other minor customizations to its
   * general behavior.
   *
   * Additionally, this component exposes the following props to modify the classes of the
   * elements: `buttonClass`.
   *
   * @public
   */
  export default defineComponent({
    name: 'SlidingPanel',
    props: {
      /**
       * Scroll factor that will dictate how much the scroll moves when pressing a navigation button.
       */
      scrollFactor: {
        type: Number,
        default: 0.7
      },
      /** Would make the navigation buttons visible when they're needed or always hide them. */
      showButtons: {
        type: Boolean,
        default: true
      },
      /**
       * When true, whenever the DOM content in the sliding panel slot changes, it will reset
       * the scroll position to 0.
       */
      resetOnContentChange: {
        type: Boolean,
        default: true
      },
      buttonClass: { type: Object as PropType<VueCSSClasses> },
      scrollContainerClass: { type: Object as PropType<VueCSSClasses> }
    },
    setup(props, { slots }) {
      /** Indicates if the scroll is at the start of the sliding panel. */
      const isScrollAtStart = ref(true);
      /** Indicates if the scroll is at the end of the sliding panel. */
      const isScrollAtEnd = ref(true);
      const scrollContainerRef = ref<HTMLDivElement>();

      /**
       * Updates the values of the scroll positions to show or hide the buttons depending on it.
       *
       * @remarks The 2px extra is to fix some cases in some resolutions where the scroll + client
       * size is less than the scroll width even when the scroll is at the end.
       */
      function updateScrollPosition() {
        if (scrollContainerRef.value) {
          const { scrollLeft, clientWidth, scrollWidth } = scrollContainerRef.value;
          isScrollAtStart.value = !scrollLeft;
          isScrollAtEnd.value = scrollLeft + clientWidth + 2 >= scrollWidth;
        }
      }

      /**
       * Debounced version of the {@link SlidingPanel.updateScrollPosition} method.
       */
      const debouncedUpdateScroll = useDebounce(updateScrollPosition, 50, { leading: true });

      /**
       * Resets the scroll and updates the values of the scroll for the buttons to react.
       */
      const debouncedRestoreAndUpdateScroll = useDebounce(
        () => {
          scrollContainerRef.value!.scroll({ left: 0, behavior: 'smooth' });
          updateScrollPosition();
        },
        50,
        { leading: true }
      );

      /**
       * Scrolls the wrapper element towards the provided scroll value.
       *
       * @param scrollValue - The value the scroll will go towards.
       */
      function scrollTo(scrollValue: number) {
        scrollContainerRef.value!.scrollBy({
          left: scrollValue * props.scrollFactor,
          behavior: 'smooth'
        });
      }

      /** Scrolls the wrapper element to the left. */
      function scrollLeft() {
        scrollTo(-scrollContainerRef.value!.clientWidth);
      }

      /** Scrolls the wrapper element to the right. */
      function scrollRight() {
        scrollTo(scrollContainerRef.value!.clientWidth);
      }

      /** CSS classes to apply based on the scroll position. */
      const cssClasses = computed(() => ({
        'x-sliding-panel-at-start': isScrollAtStart.value,
        'x-sliding-panel-at-end': isScrollAtEnd.value
      }));

      let resizeObserver: ResizeObserver;
      let contentChangedObserver: MutationObserver;

      /**
       * Initialises browser platform code:
       * - Creates a mutation observer to detect content changes and reset scroll position.
       * - Stores initial size and scroll position values.
       */
      onMounted(() => {
        resizeObserver = new ResizeObserver(debouncedUpdateScroll);
        resizeObserver.observe(scrollContainerRef.value!);
        contentChangedObserver = new MutationObserver(debouncedRestoreAndUpdateScroll);

        watch(
          () => props.resetOnContentChange,
          shouldReset => {
            if (shouldReset) {
              contentChangedObserver.observe(scrollContainerRef.value!, {
                subtree: true,
                childList: true,
                attributes: false,
                characterData: false
              });
            } else {
              contentChangedObserver.disconnect();
            }
          },
          { immediate: true }
        );

        updateScrollPosition();
      });

      onBeforeUnmount(() => {
        contentChangedObserver.disconnect();
        resizeObserver.disconnect();
      });

      return {
        cssClasses,
        debouncedUpdateScroll,
        scrollContainerRef,
        scrollLeft,
        scrollRight,
        slots
      };
    }
  });
</script>

<style lang="css" scoped>
  .x-sliding-panel {
    align-items: center;
    display: flex;
    flex-flow: row nowrap;
    position: relative;
  }

  .x-sliding-panel__button {
    opacity: 0;
    pointer-events: none;
    position: absolute;
    transition: all ease-out 0.2s;
    z-index: 2; /* To overlay the design system gradient with z-index:1 */
  }
  .x-sliding-panel-button-left {
    left: 0;
  }
  .x-sliding-panel-button-right {
    right: 0;
  }

  .x-sliding-panel__scroll {
    display: flex;
    flex: 100%;
    flex-flow: row nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE */
  }

  /* Chrome, Edge & Safari */
  .x-sliding-panel__scroll::-webkit-scrollbar {
    display: none;
  }

  .x-sliding-panel__scroll > * {
    flex: 0 0 auto;
  }

  /* prettier-ignore */
  .x-sliding-panel:not(.x-sliding-panel-show-buttons-on-hover):not(.x-sliding-panel-at-start) .x-sliding-panel-button-left {
    opacity: 1;
    pointer-events: all;
  }

  /* prettier-ignore */
  .x-sliding-panel:not(.x-sliding-panel-show-buttons-on-hover):not(.x-sliding-panel-at-end) .x-sliding-panel-button-right {
    opacity: 1;
    pointer-events: all;
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

#### Customizing the content with classes

The `buttonClass` prop can be used to add classes to the buttons.

The `scrollContainerClass` prop can be used to add classes to the scroll content.

```vue
<template>
  <SlidingPanel buttonClass="x-button--round" scrollContainerClass="x-sliding-panel-fade">
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
