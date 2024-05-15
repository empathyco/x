<script lang="ts">
  import { defineComponent, onBeforeUnmount, PropType, ref } from 'vue';
  import { ScrollDirection } from '../../../components';
  import { WireMetadata, XEvent } from '../../../wiring';
  import { scrollXModule } from '../x-module';
  import { use$x, useRegisterXModule, useScroll } from '../../../composables/index';
  import { MainScrollId } from './scroll.const';

  type ScrollableElement = 'html' | 'body';

  /**
   * The `WindowScroll` component listens to either the `html` or `body` DOM scroll events, and
   * re-emits them as X Events. Additionally it also emits events related to the direction or
   * current position of these elements scroll.
   *
   * @public
   */
  export default defineComponent({
    name: 'WindowScroll',
    xModule: scrollXModule.name,
    props: {
      /**
       * Distance to the end of the scroll that when reached will emit the
       * `scroll:about-to-end` event.
       *
       * @public
       */
      distanceToBottom: {
        type: Number,
        default: 100
      },
      /**
       * Positive vertical distance to still consider that the element is the first one visible.
       * For example, if set to 100, after scrolling 100 pixels, the first rendered element
       * will still be considered the first one.
       */
      firstElementThresholdPx: {
        type: Number,
        default: 100
      },
      /**
       * Time duration to ignore the subsequent scroll events after an emission.
       * Higher values will decrease events precision but can prevent performance issues.
       *
       * @public
       */
      throttleMs: {
        type: Number,
        default: 100
      },
      /**
       * If true (default), sets the scroll position to the top when certain events are emitted.
       *
       * @public
       */
      resetOnChange: {
        type: Boolean,
        default: true
      },
      /**
       * List of events that should reset the scroll when emitted.
       *
       * @public
       */
      resetOn: {
        type: Array as PropType<XEvent | XEvent[]>,
        default: () => [
          'SearchBoxQueryChanged',
          'SortChanged',
          'SelectedFiltersChanged',
          'SelectedFiltersForRequestChanged',
          'SelectedRelatedTagsChanged',
          'UserChangedExtraParams'
        ]
      },
      /**
       * Tag to identify the main scrollable element.
       *
       * @public
       */
      scrollableElement: {
        type: String as PropType<ScrollableElement>,
        default: 'html'
      },
      /**
       * Id to identify the component.
       *
       * @public
       */
      id: {
        type: String,
        default: MainScrollId
      }
    },
    emits: [
      'scroll',
      'scroll:at-start',
      'scroll:almost-at-end',
      'scroll:at-end',
      'scroll:direction-change'
    ],
    setup(props, { emit }) {
      useRegisterXModule(scrollXModule);
      const x = use$x();
      const throttledStoreScrollData = useScroll(props, emit).throttledStoreScrollData;

      type ElementRef = {
        $el: HTMLElement;
      };

      const el = ref<ElementRef | HTMLElement | null>(null);

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

      let $el = isElementRef(el.value) ? el.value.$el : (el.value as Element);

      /**
       * Creates the metadata for the events of this component.
       *
       * @returns A {@link WireMetadata} for the events emitted by this component.
       * @internal
       */
      const createXEventMetadata = (): Partial<WireMetadata> => {
        return { target: $el as HTMLElement, id: props.id };
      };

      /**
       * Sets the HTML element depending on {@link WindowScroll.scrollableElement}, and initialises
       * its events.
       *
       * @internal
       */
      const initAndListenElement = () => {
        $el = props.scrollableElement === 'body' ? document.body : document.documentElement;
        $el.addEventListener('scroll', throttledStoreScrollData.value);
      };

      /**
       * Cleanup listeners.
       */
      onBeforeUnmount(() => {
        $el.removeEventListener('scroll', throttledStoreScrollData.value);
      });

      return {
        throttledStoreScrollData,
        initAndListenElement,
        createXEventMetadata,
        x
      };
    },
    mounted() {
      this.initAndListenElement();
      this.$on('scroll', (position: number) => {
        this.x.emit('UserScrolled', position, this.createXEventMetadata());
      });
      this.$on('scroll:direction-change', (direction: ScrollDirection) => {
        this.x.emit('UserChangedScrollDirection', direction, this.createXEventMetadata());
      });
      this.$on('scroll:at-start', (hasReachedStart: boolean) => {
        this.x.emit('UserReachedScrollStart', hasReachedStart, this.createXEventMetadata());
      });
      this.$on('scroll:almost-at-end', (hasAlmostReachedEnd: boolean) => {
        this.x.emit('UserAlmostReachedScrollEnd', hasAlmostReachedEnd, this.createXEventMetadata());
      });
      this.$on('scroll:at-end', (hasReachedEnd: boolean) => {
        this.x.emit('UserReachedScrollEnd', hasReachedEnd, this.createXEventMetadata());
      });
    }
    // eslint-disable-next-line vue/require-render-return
    //render(): void {}
  });
</script>

<docs lang="mdx">
## Events

A list of events that the component will emit:

- [`UserScrolled`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts):
  the event is emitted after the user scrolls in this container. The payload is the scroll top
  distance in pixels.
- [`UserChangedScrollDirection`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts):
  the event is emitted when the user changes the scroll direction. The payload is the new scrolling
  direction.
- [`UserReachedScrollStart`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts):
  the event is emitted when the user scrolls up to the initial position of the scroll.
- [`UserAlmostReachedScrollEnd`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts):
  the event is emitted when the user is about to reach the bottom part of the scroll.
- [`UserReachedScrollEnd`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts):
  the event is emitted when the user has reached the bottom part of the scroll.

## Vue Events

- `scroll`: the event is emitted after the user scrolls in this container. The payload is the scroll
  top distance in pixels.
- `scroll:direction-change`: the event is emitted when the user changes the scroll direction. The
  payload is the new scrolling direction.
- `scroll:at-start`: the event is emitted when the user scrolls up to the initial position of the
  scroll.
- `scroll:almost-at-end`: the event is emitted when the user is about to reach the bottom part of
  the scroll.
- `scroll:at-end`: the event is emitted when the user has reached the bottom part of the scroll.

## Example

The `WindowScroll` component manages the scroll state of the `body` or `html` elements. It does the
necessary calculations for knowing the direction of scroll, if the scroll has reached its starting
position, if it is about to reach its ending position or if it has already reached it end. Whenever
this state changes, it emits the appropiate X Event to the rest of the application

### Custom usage

#### Overriding the properties and using document scroll events.

```vue
<template>
  <WindowScroll
    @scroll="scroll"
    @scroll:direction-change="scrollDirectionChange"
    @scroll:at-start="scrollAtStart"
    @scroll:almost-at-end="scrollAlmostAtEnd"
    @scroll:at-end="scrollAtEnd"
    id="example-main-scroll"
    throttleMs="100"
    distanceToBottom="300"
    scrollableElement="body"
  />
</template>

<script>
  import { WindowScroll } from '@empathyco/x-components/scroll';

  export default {
    name: 'ScrollIdTest',
    components: {
      WindowScroll
    },
    methods: {
      scroll(position) {
        console.log('scroll', position);
      },
      scrollDirectionChange(direction) {
        console.log('scroll:direction-change', direction);
      },
      scrollAtStart() {
        console.log('scroll:at-start', isAtStart);
      },
      scrollAlmostAtEnd(isAlmostAtEnd) {
        console.log('scroll:almost-at-end', isAlmostAtEnd);
      },
      scrollAtEnd(isAtEnd) {
        console.log('scroll:at-end', isAtEnd);
      }
    }
  };
</script>
```

#### Using body and XEvents.

If we want to listen scroll body we should do some changes in css for body. This is an example, so
therefore the height of body can be get any value that you want. The template style should have a
similar styles the corresponding style for tag body like in the next example.

```vue
<template>
  <WindowScroll
    id="example-main-scroll"
    throttleMs="100"
    distanceToBottom="300"
    scrollableElement="body"
  />
</template>

<script>
  import { WindowScroll } from '@empathyco/x-components/scroll';

  export default {
    name: 'MainComponent',
    components: {
      WindowScroll
    },
    mounted() {
      this.$x.on('UserScrolled').subscribe(distance => {
        console.log(distance);
      });
      this.$x.on('UserChangedScrollDirection').subscribe(direction => {
        console.log(direction);
      });
      this.$x.on('UserReachedScrollStart').subscribe(isAtStart => {
        console.log(isAtStart);
      });
      this.$x.on('UserAlmostReachedScrollEnd').subscribe(isAlmostAtEnd => {
        console.log(isAlmostAtEnd);
      });
      this.$x.on('UserReachedScrollEnd').subscribe(isAtEnd => {
        console.log(isAtEnd);
      });
    }
  };
</script>
<style lang="scss">
  html {
    overflow: hidden;
  }

  body {
    overflow-y: auto;
    height: 100vh;
  }
</style>
```
</docs>
