import Vue from 'vue';
import { Prop, Watch } from 'vue-property-decorator';
import Component from 'vue-class-component';
import { Dictionary } from '../../utils/types';
import { UrlParamValue } from '../../x-modules/url/store/types';
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
   * Percent of the element that has to be outside of the scroll viewport.
   *
   * @public
   */
  @Prop({ default: 0.25 })
  public hiddenPercentOfFirstItem!: number;

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
   * Property to scroll when the time out.
   *
   * @internal
   */
  protected scrollTimeout!: number;

  /**
   * Clears the time out when the component is unmounted.
   *
   * @internal
   */
  unmounted(): void {
    clearTimeout(this.scrollTimeout);
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
   * @param newScrollPosition - The new position of scroll.
   * @param oldScrollPosition - The old position of scroll.
   * @internal
   */
  @Watch('currentPosition')
  emitScroll(newScrollPosition: number, oldScrollPosition: number): void {
    this.$emit('scroll', this.currentPosition);
    this.previousPosition = oldScrollPosition;
    this.scrollTimeout = setTimeout(() => {
      if (newScrollPosition !== 0) {
        this.setFirstItemInScrollView();
      }
    }, 500);
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
   * Emits 'FirstItemInScrollViewChanged' event with the id of the first element that it is inside
   * the scroll element.
   *
   * @internal
   */
  protected setFirstItemInScrollView(): void {
    let element: HTMLElement;
    if (this.$parent.$props['tag'] === 'html') {
      element = document.documentElement;
    } else if (this.$parent.$props['tag'] === 'body') {
      element = document.body;
    } else {
      element = this.$el as HTMLElement;
    }
    if (element) {
      const scrollTargets = element.querySelectorAll<HTMLElement>('[data-scroll-id]');

      const firstElementInView = Array.from(scrollTargets).find(element =>
        this.isAnyPartOfElementInViewport(element)
      );
      if (firstElementInView) {
        this.$x.emit('FirstItemInScrollViewChanged', firstElementInView.dataset.scrollId as string);
      }
    }
  }

  /**
   * Check if an element is inside the scroll element viewport.
   *
   * @param element - The Element to check.
   *
   * @returns True if an element is inside of the scroll element viewport.
   *
   * @internal
   */
  protected isAnyPartOfElementInViewport(element: Element): boolean {
    if (!element) {
      return false;
    }
    const elementRect = element.getBoundingClientRect();
    const scrollRect = this.$el.getBoundingClientRect();

    return elementRect.top + elementRect.height * this.hiddenPercentOfFirstItem > scrollRect.top;
  }

  /**
   * Scrolls to the element.
   *
   * @param scroll - The scroll id.
   *
   * @internal
   */
  @XOn('UrlChanged')
  restoreScroll({ scroll }: Dictionary<UrlParamValue>): void {
    if (this.$el && scroll) {
      const elementToScrollTo: HTMLElement | null = this.$el.querySelector(
        `[data-scroll-id="${scroll as string}"]`
      );
      if (elementToScrollTo) {
        this.$el.scrollTop = (elementToScrollTo.offsetParent as HTMLElement).offsetTop;
      } else {
        setTimeout(() => this.restoreScroll({ scroll }));
      }
    }
  }
}
