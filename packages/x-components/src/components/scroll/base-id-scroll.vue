<template>
  <BaseScroll
    @scroll="scroll"
    @scroll:direction-change="scrollDirectionChange"
    @scroll:at-start="scrollAtStart"
    @scroll:almost-at-end="scrollAlmostAtEnd"
    @scroll:at-end="scrollAtEnd"
    @scroll:at-element="scrollAtElement"
    v-on="$listeners"
    :id="id"
    :throttleMs="throttleMs"
    :distanceToBottom="distanceToBottom"
  >
    <slot />
  </BaseScroll>
</template>

<script lang="ts">
  import { mixins } from 'vue-class-component';
  import { Component, Prop } from 'vue-property-decorator';
  import { XEvent, XEventPayload } from '../../wiring';
  import { XOn } from '../decorators/bus.decorators';
  import BaseScroll from './base-scroll.vue';
  import MainScrollMixin from './main-scroll.mixin';
  import { ScrollDirection } from './scroll.types';

  /**
   * Base scroll component that depending on base scroll component and the user interaction emits
   * different x events for knowing when the user scrolls, the direction of scroll and if user
   * reaches the start or end.
   *
   * @public
   */
  @Component({
    components: { BaseScroll }
  })
  export default class BaseIdScroll extends mixins(MainScrollMixin) {
    /**
     * Time duration to ignore the subsequent scroll events after an emission.
     * Higher values will decrease events precision but can prevent performance issues.
     *
     * @public
     */
    @Prop()
    public throttleMs!: number;

    /**
     * Distance to the end of the scroll that when reached will emit the
     * `scroll:about-to-end` event.
     *
     * @public
     */
    @Prop()
    public distanceToBottom!: number;

    /**
     * Id to identify the component.
     *
     * @public
     */
    @Prop({ default: 'scrollId' })
    public id!: string;

    /**
     * Emits the `UserScrolled` event.
     *
     * @param position - The new position of scroll.
     * @internal
     */
    protected scroll(position: number): void {
      this.emitEvent('UserScrolled', position);
    }

    /**
     * Emits the `UserChangedScrollDirection` event when the scrolling direction has changed.
     *
     * @param direction - The new direction of scroll.
     * @internal
     */
    protected scrollDirectionChange(direction: ScrollDirection): void {
      this.emitEvent('UserChangedScrollDirection', direction);
    }

    /**
     * Emits the 'UserReachedScrollStart' event when the user reaches the start.
     *
     * @internal
     */
    protected scrollAtStart(): void {
      this.emitEvent('UserReachedScrollStart');
    }

    /**
     * Emits the 'UserAlmostReachedScrollEnd' event when the user is about to reach to end.
     *
     * @param distance - A number for knowing the distance missing to end position position.
     * @internal
     */
    protected scrollAlmostAtEnd(distance: number): void {
      this.emitEvent('UserAlmostReachedScrollEnd', distance);
    }

    /**
     * Emits {@link XEventsTypes.UserScrolledToElement} with the new first visible element.
     *
     * @remarks It only emits this event if {@link BaseIdScroll.main} is `true`.
     * @param element - The `[data-scroll]` value of the first visible element.
     * @internal
     */
    protected scrollAtElement(element: string | null): void {
      if (this.main) {
        this.emitEvent('UserScrolledToElement', element ?? '');
      }
    }

    /**
     * Emits the 'UserReachedScrollEnd' event when the user is about to reach to end.
     *
     * @internal
     */
    protected scrollAtEnd(): void {
      this.emitEvent('UserReachedScrollEnd');
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
      this.$x.emit(event, payload as any, { target: this.$el as HTMLElement, id: this.id });
    }

    /**
     * Scrolls to initial position when the user has clicked the scroll to top button.
     *
     * @param scrollId - {@link XEventsTypes.UserClickedScrollToTop}.
     * @internal
     */
    @XOn('UserClickedScrollToTop')
    scrollToTop(scrollId: string): void {
      if (scrollId === this.id && this.$el) {
        this.$el?.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }
</script>

<docs lang="mdx">
# Example

The BaseIdScroll is a component that wraps the BaseScroll and provides it for a unique id.

## Events

A list of events that the component will emit:

- `UserScrolled`: emitted after the user scrolls in this container. The payload is the scroll top
  distance in pixels.
- `UserChangedScrollDirection`: emitted when the user changes the scroll direction. The payload is
  the new scrolling direction.
- `UserReachedScrollStart`: emitted when the user scrolls up to the initial position of the scroll.
- `UserAlmostReachedScrollEnd`: emitted when the user is about to reach the bottom part of the
  scroll.
- `UserReachedScrollEnd`: emitted when the user has reached the bottom part of the scroll.

## Customized usage

### Overriding the properties

It renders an element with scroll, with the content passed in the `default slot`.

```vue
<template>
  <BaseIdScroll id="exampleScrollId" throttleMs="50" distanceToBottom="300">
    <div class="content-scroll">
      <span>content1</span>
      <span>content1</span>
    </div>
  </BaseIdScroll>
</template>

<script>
  import { BaseIdScroll } from '@empathyco/x-components';

  export default {
    name: 'ScrollIdTest',
    components: {
      BaseIdScroll
    }
  };
</script>
```

## Customized usage

### Using scroll events.

```vue
<template>
  <BaseIdScroll
    @scroll="scroll"
    @scroll:direction-change="scrollDirectionChange"
    @scroll:at-start="scrollAtStart"
    @scroll:almost-at-end="scrollAlmostAtEnd"
    @scroll:at-end="scrollAtEnd"
    id="exampleScrollId"
    throttleMs="50"
    distanceToBottom="300"
  >
    <div class="content-scroll">
      <span>content1</span>
      <span>content1</span>
    </div>
  </BaseIdScroll>
</template>

<script>
  import { BaseIdScroll } from '@empathyco/x-components';

  export default {
    name: 'ScrollIdTest',
    components: {
      BaseIdScroll
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

### Using XEvents.

You can use the XEvents subscribing to them.

```vue
<template>
  <BaseIdScroll throttleMs="50" distanceToBottom="300">
    <div class="content-scroll">
      <span>content1</span>
      <span>content1</span>
    </div>
  </BaseIdScroll>
</template>

<script>
  import { BaseIdScroll } from '@empathyco/x-components';

  export default {
    name: 'ScrollIdTest',
    components: {
      BaseIdScroll
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
```

## Avoid reset scroll on query change

Set to false the reset scroll on query change feature which is true by default.

```vue
<template>
  <BaseIdScroll throttleMs="50" distanceToBottom="300" :resetOnQueryChange="false">
    <div class="content-scroll">
      <span>content1</span>
      <span>content1</span>
    </div>
  </BaseIdScroll>
</template>

<script>
  import { BaseIdScroll } from '@empathyco/x-components';

  export default {
    name: 'ScrollIdTest',
    components: {
      BaseIdScroll
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
```
</docs>
