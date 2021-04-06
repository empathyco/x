<template>
  <div @scroll="throttledStoreScrollData" class="x-base-scroll" data-test="base-scroll">
    <slot></slot>
  </div>
</template>

<script lang="ts">
  import { Component } from 'vue-property-decorator';
  import { mixins } from 'vue-class-component';
  import { throttle } from '../../utils/throttle';
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
  }
</script>

<style lang="scss" scoped>
  .x-base-scroll {
    overflow-y: auto;
  }
</style>

<docs lang="mdx">
# Example

The BaseScroll is a component that manage the states of scroll of a specified element. The component
does the necessary calculations for knowing the direction of scroll, if the scroll has reached to
start or to end, and is about to reaching to end. The components emits the next events depending of
movement that realize the user:

-scroll: when the user does some movement about scroll.

-scroll:direction-change: when the user scrolls to down or to up.

-scroll:at-start: when the user scrolls to start.

-scroll:almost-at-end: when the user scrolls and is about to end.

-scroll:at-end: when the user scrolls to end.

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
  import { BaseScroll } from '@empathy/x-components';

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
</docs>
