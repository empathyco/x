<template>
  <BaseScroll
    @scroll="scroll"
    @scroll:direction-change="scrollDirectionChange"
    @scroll:at-start="scrollAtStart"
    @scroll:almost-at-end="scrollAlmostAtEnd"
    @scroll:at-end="scrollAtEnd"
    v-on="$listeners"
    :id="id"
    :throttleMs="throttleMs"
    :distanceToBottom="distanceToBottom"
  >
    <slot />
  </BaseScroll>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { WireMetadata } from '../../../wiring/wiring.types';
  import { XOn } from '../../../components/decorators/bus.decorators';
  import BaseScroll from '../../../components/scroll/base-scroll.vue';
  import { ScrollDirection } from '../../../components/scroll/scroll.types';
  import { scrollXModule } from '../x-module';

  /**
   * Base scroll component that depending on base scroll component and the user interaction emits
   * different x events for knowing when the user scrolls, the direction of scroll and if user
   * reaches the start or end.
   *
   * @public
   */
  @Component({
    mixins: [xComponentMixin(scrollXModule)],
    components: { BaseScroll }
  })
  export default class Scroll extends Vue {
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
      this.$x.emit('UserScrolled', position, this.createEventMetadata());
    }

    /**
     * Emits the `UserChangedScrollDirection` event when the scrolling direction has changed.
     *
     * @param direction - The new direction of scroll.
     * @internal
     */
    protected scrollDirectionChange(direction: ScrollDirection): void {
      this.$x.emit('UserChangedScrollDirection', direction, this.createEventMetadata());
    }

    /**
     * Emits the 'UserReachedScrollStart' event when the user reaches the start.
     *
     * @internal
     */
    protected scrollAtStart(): void {
      this.$x.emit('UserReachedScrollStart', undefined, this.createEventMetadata());
    }

    /**
     * Emits the 'UserAlmostReachedScrollEnd' event when the user is about to reach to end.
     *
     * @param distance - A number for knowing the distance missing to end position position.
     * @internal
     */
    protected scrollAlmostAtEnd(distance: number): void {
      this.$x.emit('UserAlmostReachedScrollEnd', distance, this.createEventMetadata());
    }

    /**
     * Emits the 'UserReachedScrollEnd' event when the user is about to reach to end.
     *
     * @internal
     */
    protected scrollAtEnd(): void {
      this.$x.emit('UserReachedScrollEnd', undefined, this.createEventMetadata());
    }

    /**
     * Creates a {@link WireMetadata} metadata object for all the emitted events.
     *
     * @internal
     * @returns A new {@link WireMetadata} object.
     */
    protected createEventMetadata(): Partial<WireMetadata> {
      return { target: this.$el as HTMLElement, id: this.id };
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

The Scroll is a component that wraps the BaseScroll and provides it for a unique id.

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
  <Scroll id="exampleScrollId" throttleMs="50" distanceToBottom="300">
    <div class="content-scroll">
      <span>content1</span>
      <span>content1</span>
    </div>
  </Scroll>
</template>

<script>
  import { Scroll } from '@empathyco/x-components';

  export default {
    name: 'ScrollIdTest',
    components: {
      Scroll
    }
  };
</script>
```

## Customized usage

### Using scroll events.

```vue
<template>
  <Scroll
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
  </Scroll>
</template>

<script>
  import { Scroll } from '@empathyco/x-components';

  export default {
    name: 'ScrollIdTest',
    components: {
      Scroll
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
  <Scroll throttleMs="50" distanceToBottom="300">
    <div class="content-scroll">
      <span>content1</span>
      <span>content1</span>
    </div>
  </Scroll>
</template>

<script>
  import { Scroll } from '@empathyco/x-components';

  export default {
    name: 'ScrollIdTest',
    components: {
      Scroll
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
  <Scroll throttleMs="50" distanceToBottom="300" :resetOnQueryChange="false">
    <div class="content-scroll">
      <span>content1</span>
      <span>content1</span>
    </div>
  </Scroll>
</template>

<script>
  import { Scroll } from '@empathyco/x-components';

  export default {
    name: 'ScrollIdTest',
    components: {
      Scroll
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
