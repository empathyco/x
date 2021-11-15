<script lang="ts">
  import { mixins } from 'vue-class-component';
  import { Component, Prop } from 'vue-property-decorator';
  import { ScrollDirection, ScrollMixin, xComponentMixin } from '../../../components';
  import { WireMetadata } from '../../../wiring';
  import { scrollXModule } from '../x-module';

  type ScrollableTag = 'html' | 'body';

  /**
   * Main scroll component that depending on the user interactivity emits different events for
   * knowing when the user scrolls, the direction of scroll and if user reaches the start or end.
   * All this about main scroll.
   *
   * @public
   */
  @Component({
    mixins: [xComponentMixin(scrollXModule)]
  })
  export default class WindowScroll extends mixins(ScrollMixin) {
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

    mounted(): void {
      this.initAndListenElement();
      this.$on('scroll', (position: number) => {
        this.$x.emit('UserScrolled', position, this.createXEventMetadata());
      });
      this.$on('scroll:direction-change', (direction: ScrollDirection) => {
        this.$x.emit('UserChangedScrollDirection', direction, this.createXEventMetadata());
      });
      this.$on('scroll:at-start', (hasReachedStart: boolean) => {
        this.$x.emit('UserReachedScrollStart', hasReachedStart, this.createXEventMetadata());
      });
      this.$on('scroll:almost-at-end', (hasAlmostReachedEnd: boolean) => {
        this.$x.emit(
          'UserAlmostReachedScrollEnd',
          hasAlmostReachedEnd,
          this.createXEventMetadata()
        );
      });
      this.$on('scroll:at-end', (hasReachedEnd: boolean) => {
        this.$x.emit('UserReachedScrollEnd', hasReachedEnd, this.createXEventMetadata());
      });
    }

    /**
     * Sets the HTML element depending on {@link WindowScroll.tag}, and initialises its events.
     *
     * @internal
     */
    protected initAndListenElement(): void {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      this.$el = this.tag === 'html' ? document.documentElement : document.body;
      this.$el.addEventListener('scroll', this.throttledStoreScrollData);
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    render(): void {}

    /**
     * Cleanup listeners.
     */
    beforeDestroy(): void {
      this.$el.removeEventListener('scroll', this.throttledStoreScrollData);
    }

    /**
     * Creates the metadata for the events of this component.
     *
     * @returns A {@link WireMetadata} for the events emitted by this component.
     * @internal
     */
    protected createXEventMetadata(): Partial<WireMetadata> {
      return { target: this.$el, id: this.id };
    }
  }
</script>

<docs lang="mdx">
# Example

The WindowScroll is a component that manage the states of main scroll that can be document or body.
The component does the necessary calculations for knowing the direction of scroll, if the scroll has
reached to start or to end, and is about to reaching to end. The components emits the next events
and XEvents depending of movement that realize the user:

## Custom usage

### Overriding the properties and using document scroll events.

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
    tag="document"
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

## Customized usage

### Using body and XEvents.

If we want to listen scroll body we should do some changes in css for body. This is an example, so
therefore the height of body can be get any value that you want. The template style should have a
similar styles the corresponding style for tag body like in the next example.

```vue
<template>
  <WindowScroll id="example-main-scroll" throttleMs="100" distanceToBottom="300" tag="body" />
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
