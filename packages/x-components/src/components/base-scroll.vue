<template>
  <div @scroll="throttledStoreScrollData" class="x-base-scroll" data-test="base-scroll">
    <slot></slot>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop, Watch } from 'vue-property-decorator';
  import { throttle } from '../utils/throttle';
  import { ScrollDirection } from './x-component.types';

  /**
   * Base scroll component that depending on the user interactivity emits different events for
   * knowing when the user scrolls, the direction of scroll and if user reaches the start or end.
   *
   * @public
   */
  @Component
  export default class BaseScroll extends Vue {
    /**
     * Time duration to ignore the subsequent scroll events after an emission.
     * Higher values will decrease events precision but can lead to performance issues.
     *
     * @public
     */
    @Prop({ default: 100 })
    public throttleMs!: number;

    /**
     * Distance to the end of the scroll that when reached will emit the
     * `scroll:about-to-end` event.
     *
     * @public
     */
    @Prop({ default: 100 })
    public bottomAlertDistance!: number;

    /**
     * Property for getting the current position of scroll.
     *
     * @internal
     */
    protected currentPosition = 0;

    /**
     * Property for getting the previous position of scroll.
     *
     * @internal
     */
    protected previousPosition = 0;

    /**
     * Property for getting the scroll height.
     *
     * @internal
     */
    protected scrollHeight = 0;

    /**
     * Property for getting the client height of scroll.
     *
     * @internal
     */
    protected clientHeight = 0;

    /**
     * Property for getting the direction of scroll.
     *
     * @internal
     */
    protected direction!: ScrollDirection;

    /**
     * Throttled version of the function that stores the DOM scroll related properties.
     * The duration of the throttle is configured through the {@link BaseScroll.throttleMs}.
     *
     * @internal
     */
    // eslint-disable-next-line @typescript-eslint/unbound-method
    protected throttledStoreScrollData = throttle(this.storeScrollData, this.throttleMs);

    /**
     * Returns end position of scroll.
     *
     * @returns A number for knowing end position of scroll.
     * @internal
     */
    protected get scrollEndPosition(): number {
      return this.scrollHeight - this.clientHeight;
    }

    /**
     * Returns distance missing to end position position.
     *
     * @returns A number for knowing the distance missing to end position position.
     * @internal
     */
    protected get distanceToEnd(): number {
      return this.scrollEndPosition - this.currentPosition;
    }

    /**
     * Returns `true` when the scroll is at the initial position.
     *
     * @returns A boolean for knowing if the user scrolls to the start.
     * @internal
     */
    protected get hasScrollReachedStart(): boolean {
      return this.currentPosition === 0;
    }

    /**
     * Returns direction of scroll based in {@link ScrollDirection}.
     *
     * @returns A string for knowing the scroll direction.
     * @internal
     */
    protected get scrollDirection(): ScrollDirection {
      return this.currentPosition > this.previousPosition ? 'DOWN' : 'UP';
    }

    /**
     * Returns `true` when the amount of pixels scrolled is greater than
     * the {@link BaseScroll.bottomAlertDistance}.
     *
     * @returns A boolean for knowing if the user is about to reaching to the end.
     * @internal
     */
    protected get hasScrollAlmostReachedEnd(): boolean {
      return !this.hasScrollReachedStart && this.bottomAlertDistance > this.distanceToEnd;
    }

    /**
     * Returns `true` when there is no more content to scroll.
     *
     * @returns A boolean for knowing if the user scrolls to the end.
     * @internal
     */
    protected get hasScrollReachedEnd(): boolean {
      return this.currentPosition === this.scrollEndPosition;
    }

    mounted(): void {
      this.storeScrollData();
    }

    /**
     * Emits the `scroll` event.
     *
     * @param _newScrollPosition - The new position of scroll.
     * @param oldScrollPosition - The old position of scroll.
     * @internal
     */
    @Watch('currentPosition')
    emitScroll(_newScrollPosition: number, oldScrollPosition: number): void {
      this.$emit('scroll', this.currentPosition);
      this.previousPosition = oldScrollPosition;
    }

    /**
     * Emits the `scroll:direction-change` event when the scrolling direction has changed.
     *
     * @param direction - The new direction of scroll.
     * @internal
     */
    @Watch('scrollDirection')
    emitScrollDirection(direction: ScrollDirection): void {
      this.$emit('scroll:direction-change', direction);
    }

    /**
     * Emits the 'scroll:at-start' event when the user reaches the start.
     *
     * @param isScrollAtStart - For knowing if the user reaches at start.
     * @internal
     */
    @Watch('hasScrollReachedStart')
    emitScrollReachedAtStart(isScrollAtStart: boolean): void {
      if (isScrollAtStart) {
        this.$emit('scroll:at-start');
      }
    }

    /**
     * Emits the 'scroll:almost-at-end' event when the user is about to reach to end.
     *
     * @param isScrollAlmostAtEnd - For knowing if the user is about to reach to end.
     * @internal
     */
    @Watch('hasScrollAlmostReachedEnd')
    emitScrollAlmostAtEnd(isScrollAlmostAtEnd: boolean): void {
      if (isScrollAlmostAtEnd) {
        this.$emit('scroll:almost-at-end', this.distanceToEnd);
      }
    }

    /**
     * Emits the 'scroll:at-end' event when the user reaches the end.
     *
     * @param isScrollAtEnd - For knowing if the user reaches at end.
     * @internal
     */
    @Watch('hasScrollReachedEnd')
    emitScrollAtEnd(isScrollAtEnd: boolean): void {
      if (isScrollAtEnd) {
        this.$emit('scroll:at-end');
      }
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
    bottomAlertDistance="200"
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
