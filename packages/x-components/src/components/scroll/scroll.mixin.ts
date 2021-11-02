import Vue from 'vue';
import { Prop, Watch } from 'vue-property-decorator';
import Component from 'vue-class-component';
import { UrlParams } from '../../types/url-params';
import { debounce } from '../../utils/debounce';
import { throttle } from '../../utils/throttle';
import { XOn } from '../decorators/bus.decorators';
import { ScrollDirection } from './scroll.types';

/**
 * Mixin to share Scroll logic.
 *
 * @public
 */
@Component
export default class ScrollMixin extends Vue {
  /**
   * If `true`, sets this scroll instance to the main of the application. Being the main
   * scroll implies that features like restoring the scroll when the query changes, or storing
   * the scroll position in the URL will be enabled for this container.
   *
   * @public
   */
  @Prop({ default: false })
  public main!: boolean;

  /**
   * If true (default), sets the scroll position to top when an
   * {@link XEventsTypes.UserAcceptedAQuery} event is emitted.
   *
   * @public
   */
  @Prop({
    type: Boolean,
    default(this: { main: boolean }) {
      return this.main;
    }
  })
  protected resetOnQueryChange!: boolean;

  /**
   * Time duration to ignore the subsequent scroll events after an emission.
   * Higher values will decrease events precision but can prevent performance issues.
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
  public distanceToBottom!: number;

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
   * @returns The scroll direction.
   * @internal
   */
  protected get scrollDirection(): ScrollDirection {
    return this.currentPosition > this.previousPosition ? 'DOWN' : 'UP';
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
   * Emits the 'scroll:at-start' event when the user reaches the start.
   *
   * @param isScrollAtStart - For knowing if the user reaches at start.
   * @internal
   */
  @Watch('hasScrollReachedStart')
  protected emitScrollReachedAtStart(isScrollAtStart: boolean): void {
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
  protected emitScrollAlmostAtEnd(isScrollAlmostAtEnd: boolean): void {
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
  protected emitScrollAtEnd(isScrollAtEnd: boolean): void {
    if (isScrollAtEnd) {
      this.$emit('scroll:at-end');
    }
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

  protected observer?: MutationObserver;

  @XOn('ParamsLoadedFromUrl')
  storeUrlScrollPosition({ scroll }: UrlParams): void {
    /* FIXME: If the scroll component is destroyed and remounted this logic will be executed again,
     trying to scroll */
    if (this.main && scroll) {
      this.observer = new MutationObserver(
        debounce((_entries, observer) => {
          const scrollTarget = this.getScrollElement()?.querySelector<HTMLElement>(
            `[data-scroll="${scroll}"]`
          );
          if (scrollTarget) {
            scrollTarget?.scrollIntoView();
            observer.disconnect();
          }
        }, 0)
      );
    }
  }

  protected getScrollElement(): HTMLElement | void {
    // TODO Use empathy's logger.
    // eslint-disable-next-line no-console
    console.warn('[ScrollMixin] Scroll components must override getScrollElement() method.');
  }

  mounted(): void {
    const element = this.getScrollElement();
    if (!element) {
      return;
    }
    this.storeScrollData(element);
    if (this.main && this.observer) {
      this.observer.observe(element, {
        childList: true,
        subtree: true
      });
    }
  }

  /**
   * Throttled version of the function that stores the DOM scroll related properties.
   * The duration of the throttle is configured through the
   * {@link ScrollMixin.throttleMs}.
   *
   * @internal
   */
  // eslint-disable-next-line @typescript-eslint/unbound-method
  protected throttledStoreScrollData = throttle(this.storeScrollData, this.throttleMs);

  /**
   * Updates scroll related properties.
   *
   * @param scrollElement - The scroll container HTML element.
   * @internal
   */
  protected storeScrollData(scrollElement: HTMLElement = this.getScrollElement()!): void {
    this.currentPosition = scrollElement.scrollTop;
    this.scrollHeight = scrollElement.scrollHeight;
    this.clientHeight = scrollElement.clientHeight;

    // TODO - Move this logic
    if (this.main) {
      const firstElementInView = Array.from(
        scrollElement.querySelectorAll<HTMLElement>('[data-scroll]')
      ).find(
        element => element.getBoundingClientRect().top > scrollElement.getBoundingClientRect().top
      );
      if (firstElementInView) {
        this.$x.emit('UserScrolledToElement', firstElementInView.dataset.scroll!);
      }
    }
  }
}
