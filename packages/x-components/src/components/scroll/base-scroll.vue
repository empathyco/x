<template>
  <div @scroll="throttledStoreScrollData" class="x-scroll x-base-scroll" data-test="base-scroll">
    <slot></slot>
  </div>
</template>

<script lang="ts">
  import { mixins } from 'vue-class-component';
  import { Component } from 'vue-property-decorator';
  import ScrollMixin from './scroll.mixin';

  /**
   * Base scroll component that depending on the user interactivity emits different events for
   * knowing when the user scrolls, the direction of scroll and if user reaches the start or end.
   *
   * @public
   */
  @Component
  export default class BaseScroll extends mixins(ScrollMixin) {
    protected override getScrollElement(): HTMLElement | void {
      return this.$el as HTMLElement;
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
