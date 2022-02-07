import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { throttle } from '../../utils/throttle';
import { XEvent } from '../../wiring/events.types';
import { XOn } from '../decorators/bus.decorators';
import { ScrollDirection } from './scroll.types';

/**
 * Mixin to share Scroll logic.
 *
 * @public
 */
@Component
/* eslint-disable @typescript-eslint/unbound-method */
export default class ScrollMixin extends Vue {
  /**
   * The scrolling container reference.
   *
   * @public
   */
  public $el!: HTMLElement;
  /**
   * Distance to the end of the scroll that when reached will emit the
   * `scroll:about-to-end` event.
   *
   * @public
   */
  @Prop({ default: 100 })
  public distanceToBottom!: number;
  /**
   * Positive vertical distance to still consider that the an element is the first one visible.
   * For example, if set to 100, after scrolling 100 pixels, the first rendered element
   * will still be considered the first one.
   */
  @Prop({ default: 100 })
  public firstElementThresholdPx!: number;
  /**
   * Time duration to ignore the subsequent scroll events after an emission.
   * Higher values will decrease events precision but can prevent performance issues.
   *
   * @public
   */
  @Prop({ default: 100 })
  public throttleMs!: number;

  /**
   * If true (default), sets the scroll position to the top when certain events are emitted.
   *
   * @public
   */
  @Prop({ type: Boolean, default: true })
  protected resetOnChange!: boolean;

  /**
   * List of events that should reset the scroll when emitted.
   *
   * @public
   */
  @Prop({
    default: () => [
      'SearchBoxQueryChanged',
      'SortChanged',
      'SelectedFiltersChanged',
      'SelectedRelatedTagsChanged',
      'UserChangedExtraParams'
    ]
  })
  public resetOn!: XEvent;

  /**
   * Property for getting the client height of scroll.
   *
   * @internal
   */
  protected clientHeight = 0;
  /**
   * Property for getting the current position of scroll.
   *
   * @internal
   */
  protected currentPosition = 0;
  /**
   * Property for getting the direction of scroll.
   *
   * @internal
   */
  protected direction!: ScrollDirection;
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
   * Throttled version of the function that stores the DOM scroll related properties.
   * The duration of the throttle is configured through the
   * {@link ScrollMixin.throttleMs}.
   *
   * @returns A throttled version of the function to store the scroll data.
   * @internal
   */
  protected get throttledStoreScrollData(): () => void {
    return throttle(this.storeScrollData, this.throttleMs);
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
   * Returns `true` when the amount of pixels scrolled is greater than
   * the {@link ScrollMixin.distanceToBottom}.
   *
   * @returns A boolean for knowing if the user is about to reaching to the end.
   * @internal
   */
  protected get hasScrollAlmostReachedEnd(): boolean {
    return !this.hasScrollReachedStart && this.distanceToBottom > this.distanceToEnd;
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
   * @returns The scroll direction.
   * @internal
   */
  protected get scrollDirection(): ScrollDirection {
    return this.currentPosition > this.previousPosition ? 'DOWN' : 'UP';
  }

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
   * Initialises DOM dependant scroll properties.
   *
   * @internal
   */
  mounted(): void {
    this.$nextTick().then(() => {
      if (!this.$el) {
        // TODO Replace with Empathy's logger
        // eslint-disable-next-line no-console
        console.warn(
          '[ScrollMixin]',
          'Components using this mixin must set `this.$el` to the HTML node that is scrolling.'
        );
      } else {
        this.storeScrollData();
      }
    });
  }

  /**
   * Resets the scroll position.
   *
   * @internal
   */
  @XOn(instance => (instance as ScrollMixin).resetOn)
  resetScroll(): void {
    this.$nextTick().then(() => {
      if (this.resetOnChange) {
        this.$el.scrollTo({ top: 0 });
      }
    });
  }

  /**
   * Emits the `scroll` event.
   *
   * @param _newScrollPosition - The new position of scroll.
   * @param oldScrollPosition - The old position of scroll.
   * @internal
   */
  @Watch('currentPosition')
  protected emitScroll(_newScrollPosition: number, oldScrollPosition: number): void {
    this.$emit('scroll', this.currentPosition);
    this.previousPosition = oldScrollPosition;
  }

  /**
   * Emits the 'scroll:at-start' event when the user reaches the start.
   *
   * @param isScrollAtStart - For knowing if the user reaches at start.
   * @internal
   */
  @Watch('hasScrollReachedStart')
  protected emitScrollReachedAtStart(isScrollAtStart: boolean): void {
    this.$emit('scroll:at-start', isScrollAtStart);
  }

  /**
   * Emits the 'scroll:almost-at-end' event when the user is about to reach to end.
   *
   * @param isScrollAlmostAtEnd - For knowing if the user is about to reach to end.
   * @internal
   */
  @Watch('hasScrollAlmostReachedEnd')
  protected emitScrollAlmostAtEnd(isScrollAlmostAtEnd: boolean): void {
    this.$emit('scroll:almost-at-end', isScrollAlmostAtEnd);
  }

  /**
   * Emits the 'scroll:at-end' event when the user reaches the end.
   *
   * @param isScrollAtEnd - For knowing if the user reaches at end.
   * @internal
   */
  @Watch('hasScrollReachedEnd')
  protected emitScrollAtEnd(isScrollAtEnd: boolean): void {
    this.$emit('scroll:at-end', isScrollAtEnd);
  }

  /**
   * Emits the `scroll:direction-change` event when the scrolling direction has changed.
   *
   * @param direction - The new direction of scroll.
   * @internal
   */
  @Watch('scrollDirection')
  protected emitScrollDirection(direction: ScrollDirection): void {
    this.$emit('scroll:direction-change', direction);
  }

  /**
   * Updates scroll related properties.
   *
   * @internal
   */
  protected storeScrollData(): void {
    if (this.$el) {
      this.currentPosition = this.$el.scrollTop;
      this.scrollHeight = this.$el.scrollHeight;
      this.clientHeight = this.$el.clientHeight;
    }
  }
}
/*  eslint-enable @typescript-eslint/unbound-method */
