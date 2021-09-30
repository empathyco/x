<template>
  <div @scroll="throttledStoreScrollData" class="x-scroll x-base-scroll" data-test="base-scroll">
    <slot></slot>
  </div>
</template>

<script lang="ts">
  import { Component, Prop } from 'vue-property-decorator';
  import { mixins } from 'vue-class-component';
  import { throttle } from '../../utils/throttle';
  import { XOn } from '../decorators/bus.decorators';
  import ScrollMixin from './scroll.mixin';

  /**
   * Base scroll component that depending on the user interactivity emits different events for
   * knowing when the user scrolls, the direction of scroll and if user reaches the start or end.
   *
   * @public
   */
  @Component
  export default class BaseScroll extends mixins(ScrollMixin) {
    /**
     * If true (default), sets the scroll position to top when an
     * {@link XEventsTypes.UserAcceptedAQuery} event is emitted.
     *
     * @public
     */
    @Prop({ default: true })
    protected resetOnQueryChange!: boolean;

    /**
     * Throttled version of the function that stores the DOM scroll related properties.
     * The duration of the throttle is configured through the
     * {@link ScrollMixin.throttleMs}.
     *
     * @internal
     */
    // eslint-disable-next-line @typescript-eslint/unbound-method
    protected throttledStoreScrollData = throttle(this.storeScrollData, this.throttleMs);

    mounted(): void {
      this.storeScrollData();
    }

    /**
     * Updates scroll related properties.
     *
     * @internal
     */
    protected storeScrollData(): void {
      this.currentPosition = this.$el.scrollTop;
      this.scrollHeight = this.$el.scrollHeight;
      this.clientHeight = this.$el.clientHeight;
    }

    /**
     * It sets the scroll to top if the property `resetOnQueryChange` is true.
     *
     * @internal
     */
    @XOn([
      'SearchBoxQueryChanged',
      'SortChanged',
      'SelectedFiltersChanged',
      'SelectedRelatedTagsChanged'
    ])
    scrollToTop(): void {
      if (this.resetOnQueryChange) {
        this.$el?.scrollTo({ top: 0 });
      }
    }
  }
</script>

<style lang="scss" scoped>
  .x-base-scroll {
    overflow-y: var(--x-string-overflow-scroll, auto);
  }
</style>

<docs lang="mdx">
# Example

The BaseScroll is a component that manage the states of scroll of a specified element. The component
does the necessary calculations for knowing the direction of scroll, if the scroll has reached to
start or to end, and is about to reaching to end. The components emits the next events depending of
movement that realize the user:

```vue
<template>
  <BaseScroll
    @scroll="scroll"
    @scroll:direction-change="scrollDirectionChange"
    @scroll:at-start="scrollAtStart"
    @scroll:almost-at-end="scrollAlmostAtEnd"
    @scroll:at-end="scrollAtEnd"
    throttleMs="1000"
    distanceToBottom="200"
  >
    <template>
      <div class="content-scroll">
        <span>content1</span>
        <span>content1</span>
      </div>
    </template>
  </BaseScroll>
</template>

<script>
  import { BaseScroll } from '@empathyco/x-components';

  export default {
    name: 'ScrollTest',
    components: {
      BaseScroll
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

## Avoid reset scroll on query change

Set to false the reset scroll on query change feature which is true by default.

```vue
<template>
  <BaseScroll
    @scroll="scroll"
    @scroll:direction-change="scrollDirectionChange"
    @scroll:at-start="scrollAtStart"
    @scroll:almost-at-end="scrollAlmostAtEnd"
    @scroll:at-end="scrollAtEnd"
    :resetOnQueryChange="false"
    throttleMs="1000"
    distanceToBottom="200"
  >
    <template>
      <div class="content-scroll">
        <span>content1</span>
        <span>content1</span>
      </div>
    </template>
  </BaseScroll>
</template>

<script>
  import { BaseScroll } from '@empathyco/x-components';

  export default {
    name: 'ScrollTest',
    components: {
      BaseScroll
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
</docs>
