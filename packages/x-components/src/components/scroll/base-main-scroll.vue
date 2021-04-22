<script lang="ts">
  import { Component, Prop } from 'vue-property-decorator';
  import { mixins } from 'vue-class-component';
  import { throttle } from '../../utils/throttle';
  import { XEvent, XEventPayload } from '../../wiring';
  import ScrollMixin from './scroll.mixin';
  import { ScrollDirection } from './scroll.types';

  type ScrollableTag = 'html' | 'body';

  /**
   * Main scroll component that depending on the user interactivity emits different events for
   * knowing when the user scrolls, the direction of scroll and if user reaches the start or end.
   * All this about main scroll.
   *
   * @public
   */
  @Component
  export default class BaseMainScroll extends mixins(ScrollMixin) {
    /**
     * Tag to identify the main scrollable element.
     *
     * @public
     */
    @Prop({ default: 'html' })
    protected tag!: ScrollableTag;

    /**
     * Id to identify the component.
     *
     * @public
     */
    @Prop({ default: 'main-scroll' })
    protected id!: string;

    /**
     * The HTMLElement to use as the scrollable element based on {@link BaseMainScroll.tag}.
     *
     * @public
     */
    protected element!: HTMLElement;

    /**
     * Main element of page for listening the event scroll.
     *
     * @internal
     */
    protected elementListener!: Document | HTMLElement;

    /**
     * Throttled version of the function that stores the DOM scroll related properties.
     * The duration of the throttle is configured through the
     * {@link ScrollMixin.throttleMs }.
     *
     * @internal
     */
    // eslint-disable-next-line @typescript-eslint/unbound-method
    protected throttledStoreScrollData = throttle(this.storeScrollData, this.throttleMs);

    mounted(): void {
      this.initAndListenElement();

      this.$on('scroll', (position: number) => {
        this.emitEvent('UserScrolled', position);
      });

      this.$on('scroll:direction-change', (direction: ScrollDirection) => {
        this.emitEvent('UserChangedScrollDirection', direction);
      });

      this.$on('scroll:at-start', () => {
        this.emitEvent('UserReachedScrollStart');
      });

      this.$on('scroll:almost-at-end', (distance: number) => {
        this.emitEvent('UserAlmostReachedScrollEnd', distance);
      });

      this.$on('scroll:at-end', () => {
        this.emitEvent('UserReachedScrollEnd');
      });
    }

    /**
     * Get the element depends on {@link BaseMainScroll.tag} if is html or body
     * and listen the event scroll.
     *
     * @internal
     */
    protected initAndListenElement(): void {
      if (this.tag === 'html') {
        this.element = document.documentElement;
        this.elementListener = document;
      } else {
        this.element = document.body;
        this.elementListener = document.body;
      }

      this.elementListener.addEventListener('scroll', this.throttledStoreScrollData);
    }

    /**
     * Updates main scroll related properties.
     *
     * @internal
     */
    protected storeScrollData(): void {
      this.currentPosition = this.element.scrollTop;
      this.scrollHeight = this.element.scrollHeight;
      this.clientHeight = this.element.clientHeight;
    }

    /**
     * Emits the event corresponding passed as parameter when the user has scrolled.
     *
     * @param event - Name of event to emit.
     * @internal
     */
    protected emitEvent<Event extends XEvent>(event: Event): void;
    /**
     * Emits the event corresponding passed as parameter when the user has scrolled.
     *
     * @param event - Name of event to emit.
     * @param payload - Data to send in the event like payload. {@link ScrollDirection | number}.
     * @internal
     */
    protected emitEvent<Event extends XEvent>(event: Event, payload: XEventPayload<Event>): void;
    /**
     * Emits the event corresponding passed as parameter when the user has scrolled.
     *
     * @param event - Name of event to emit.
     * @param payload - Optional data to send in the event like payload.
     * {@link ScrollDirection | number}.
     *
     * @internal
     */
    protected emitEvent<Event extends XEvent>(event: Event, payload?: XEventPayload<Event>): void {
      this.$x.emit(event, payload as any, { target: this.element, id: this.id });
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    render(): void {}

    beforeDestroy(): void {
      this.elementListener.removeEventListener('scroll', this.throttledStoreScrollData);
    }
  }
</script>

<docs lang="mdx">
# Example

The BaseMainScroll is a component that manage the states of main scroll that can be document or
body. The component does the necessary calculations for knowing the direction of scroll, if the
scroll has reached to start or to end, and is about to reaching to end. The components emits the
next events and XEvents depending of movement that realize the user:

## Customized usage

### Overriding the properties and using document scroll events.

```vue
<template>
  <BaseMainScroll
    @scroll="scroll"
    @scroll:direction-change="scrollDirectionChange"
    @scroll:at-start="scrollAtStart"
    @scroll:almost-at-end="scrollAlmostAtEnd"
    @scroll:at-end="scrollAtEnd"
    id="example-main-scroll"
    throttleMs="100"
    distanceToBottom="300"
    tag="document"
  />
</template>

<script>
  import { BaseMainScroll } from '@empathy/x-components';

  export default {
    name: 'ScrollIdTest',
    components: {
      BaseMainScroll
    },
    methods: {
      scroll(position) {
        console.log('scroll', position);
      },
      scrollDirectionChange(direction) {
        console.log('scroll:direction-change', direction);
      },
      scrollAtStart() {
        console.log('scroll:at-start');
      },
      scrollAlmostAtEnd(distance) {
        console.log('scroll:almost-at-end', distance);
      },
      scrollAtEnd() {
        console.log('scroll:at-end');
      }
    }
  };
</script>
```

## Customized usage

### Using body and XEvents.

If we want to listen scroll body we should do some changes in css for body. This is an example, so
therefore the height of body can be get any value that you want. The template style should have a
similar styles the corresponding style for tag body like in the next example.

```vue
<template>
  <BaseMainScroll id="example-main-scroll" throttleMs="100" distanceToBottom="300" tag="body" />
</template>

<script>
  import { BaseMainScroll } from '@empathy/x-components';

  export default {
    name: 'MainComponent',
    components: {
      BaseMainScroll
    },
    mounted() {
      this.$x.on('UserScrolled').subscribe(event => {
        console.log(event);
      });
      this.$x.on('UserChangedScrollDirection').subscribe(event => {
        console.log(event);
      });
      this.$x.on('UserReachedScrollStart').subscribe(event => {
        console.log(event);
      });
      this.$x.on('UserAlmostReachedScrollEnd').subscribe(event => {
        console.log(event);
      });
      this.$x.on('UserReachedScrollEnd').subscribe(event => {
        console.log(event);
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

## Vue Events:

- `scroll`: the event is emitted after the user scrolls in this container. The payload is the scroll
  top distance in pixels.
- `scroll:direction-change`: the event is emitted when the user changes the scroll direction. The
  payload is the new scrolling direction.
- `scroll:at-start`: the event is emitted when the user scrolls up to the initial position of the
  scroll.
- `scroll:almost-at-end`: the event is emitted when the user is about to reach the bottom part of
  the scroll.
- `scroll:at-end`: the event is emitted when the user has reached the bottom part of the scroll.

## Events

A list of events that the component will emit:

- `UserScrolled`: the event is emitted after the user scrolls in this container. The payload is the
  scroll top distance in pixels.
- `UserChangedScrollDirection`: the event is emitted when the user changes the scroll direction. The
  payload is the new scrolling direction.
- `UserReachedScrollStart`: the event is emitted when the user scrolls up to the initial position of
  the scroll.
- `UserAlmostReachedScrollEnd`: the event is emitted when the user is about to reach the bottom part
  of the scroll.
- `UserReachedScrollEnd`: the event is emitted when the user has reached the bottom part of the
  scroll.
</docs>
