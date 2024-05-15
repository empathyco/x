import { computed, nextTick, onMounted, Ref, ref, watch } from 'vue';
import { XEvent } from '../wiring/index';
import { ScrollDirection } from '../components/index';
import { throttle } from '../utils/throttle';
import { use$x } from './use-$x';

type EmitType = (
  event:
    | 'scroll'
    | 'scroll:at-start'
    | 'scroll:almost-at-end'
    | 'scroll:at-end'
    | 'scroll:direction-change',
  ...args: any[]
) => void;

/**
 * Composable to share Scroll logic.
 *
 * @param props
 * @param emit
 * @returns A throttled version of the function to store the scroll data.
 * @public
 */
export function useScroll(
  props: {
    /**
     * Distance to the end of the scroll that when reached will emit the
     * `scroll:about-to-end` event.
     *
     * @public
     */
    distanceToBottom: number;
    /**
     * Positive vertical distance to still consider that the element is the first one visible.
     * For example, if set to 100, after scrolling 100 pixels, the first rendered element
     * will still be considered the first one.
     */
    firstElementThresholdPx: number;
    /**
     * Time duration to ignore the subsequent scroll events after an emission.
     * Higher values will decrease events precision but can prevent performance issues.
     *
     * @public
     */
    throttleMs: number;
    /**
     * If true (default), sets the scroll position to the top when certain events are emitted.
     *
     * @public
     */
    resetOnChange: boolean;
    /**
     * List of events that should reset the scroll when emitted.
     *
     * @public
     */
    resetOn: XEvent | XEvent[];
  },
  emit: EmitType
) {
  type ElementRef = {
    $el: HTMLElement;
  };

  /**
   * The scrolling container reference.
   *
   * @public
   */
  const el = ref<ElementRef | HTMLElement | null>(null);

  /**
   * Property for getting the client height of scroll.
   *
   * @internal
   */
  const clientHeight = ref(0);

  /**
   * Property for getting the current position of scroll.
   *
   * @internal
   */
  const currentPosition = ref(0);

  /**
   * Property for getting the direction of scroll.
   *
   * @internal
   */
  //const direction!: ScrollDirection;

  /**
   * Property for getting the previous position of scroll.
   *
   * @internal
   */
  const previousPosition = ref(0);

  /**
   * Property for getting the scroll height.
   *
   * @internal
   */
  const scrollHeight = ref(0);
  /**
   * Flag to know if the property clientHeight is changing or gets the final value.
   *
   * @internal
   */
  const isClientHeightChanging = ref(false);

  /**
   * Property for setting the direction of scroll.
   *
   * @internal
   */
  const scrollDirection: Ref<ScrollDirection> = ref('UP');

  /**
   * Restores the clientHeight flag when clientHeight property stops changing.
   * Also sets a new previous position, before update the current one.
   *
   * @internal
   */
  const restoreClientHeightFlag = (): void => {
    isClientHeightChanging.value = false;
    previousPosition.value = currentPosition.value;
  };

  const throtteledCall = throttle(restoreClientHeightFlag, 100);

  /**
   * Checks if a given value is an `ElementRef` object.
   *
   * @param value - The value to check.
   * @returns `true` if the value is an `ElementRef` object, `false` otherwise.
   *
   * @internal
   */
  const isElementRef = (value: any): value is ElementRef => {
    return value && value.$el instanceof HTMLElement;
  };
  const $el = isElementRef(el.value) ? el.value.$el : (el.value as Element);
  /**
   * Updates scroll related properties.
   *
   * @internal
   */
  const storeScrollData = () => {
    if ($el) {
      currentPosition.value = $el.scrollTop;
      scrollHeight.value = $el.scrollHeight;
      clientHeight.value = $el.clientHeight;
    }
  };

  /**
   * Throttled version of the function that stores the DOM scroll related properties.
   * The duration of the throttle is configured through the
   * {@link ScrollMixin.throttleMs}.
   *
   * @returns A throttled version of the function to store the scroll data.
   * @internal
   */
  const throttledStoreScrollData = computed(() => {
    return throttle(storeScrollData, props.throttleMs);
  });

  /**
   * Returns end position of scroll.
   *
   * @returns A number for knowing end position of scroll.
   * @internal
   */
  const scrollEndPosition = computed(() => {
    return scrollHeight.value - clientHeight.value;
  });

  /**
   * Returns distance missing to endPosition position.
   *
   * @returns A number for knowing the distance missing to endPosition position.
   * @internal
   */
  const distanceToEnd = computed(() => {
    return scrollEndPosition.value - currentPosition.value;
  });

  /**
   * Returns `true` when there is no more content to scroll.
   *
   * @returns A boolean for knowing if the user scrolls to the end.
   * @internal
   */
  const hasScrollReachedEnd = computed(() => {
    return currentPosition.value === scrollEndPosition.value;
  });

  /**
   * Returns `true` when the scroll is at the initial position.
   *
   * @returns A boolean for knowing if the user scrolls to the start.
   * @internal
   */
  const hasScrollReachedStart = computed(() => {
    return currentPosition.value === 0;
  });

  /**
   * Returns `true` when the amount of pixels scrolled is greater than
   * the {@link ScrollMixin.distanceToBottom}.
   *
   * @returns A boolean for knowing if the user is about to reaching to the end.
   * @internal
   */
  const hasScrollAlmostReachedEnd = computed(() => {
    return !hasScrollReachedStart.value && props.distanceToBottom > distanceToEnd.value;
  });

  onMounted(() => {
    nextTick().then(() => {
      if (!$el) {
        // TODO Replace with Empathy's logger
        // eslint-disable-next-line no-console
        console.warn(
          '[ScrollMixin]',
          'Components using this mixin must set `this.$el` to the HTML node that is scrolling.'
        );
      } else {
        storeScrollData();
      }
    });
  });

  /**
   * Change the isClientHeightChanging flag when the property clientHeight is changing and
   * calls throttleledCall method.
   *
   * @internal
   */
  watch(
    clientHeight,
    () => {
      isClientHeightChanging.value = true;

      throtteledCall();
    },
    { immediate: true }
  );

  /**
   * Emits the `scroll` event.
   *
   * @param _newScrollPosition - The new position of scroll.
   * @param oldScrollPosition - The old position of scroll.
   * @internal
   */
  watch(currentPosition, (_newScrollPosition: number, oldScrollPosition: number) => {
    emit('scroll', currentPosition.value);
    previousPosition.value = oldScrollPosition;
  });

  /**
   * Emits the 'scroll:almost-at-end' event when the user is about to reach to end.
   *
   * @param isScrollAlmostAtEnd - For knowing if the user is about to reach to end.
   * @internal
   */
  watch(hasScrollReachedStart, (isScrollAtStart: boolean) => {
    emit('scroll:at-start', isScrollAtStart);
  });

  /**
   * Sets direction of scroll based in {@link ScrollDirection} when the current position
   * has changed.
   *
   * @internal
   */
  watch(hasScrollAlmostReachedEnd, (isScrollAlmostAtEnd: boolean) => {
    emit('scroll:almost-at-end', isScrollAlmostAtEnd);
  });

  /**
   * Emits the 'scroll:at-end' event when the user reaches the end.
   *
   * @param isScrollAtEnd - For knowing if the user reaches at end.
   * @internal
   */
  watch(hasScrollReachedEnd, (isScrollAtEnd: boolean) => {
    emit('scroll:at-end', isScrollAtEnd);
  });

  /**
   * Emits the `scroll:direction-change` event when the scrolling direction has changed.
   *
   * @param direction - The new direction of scroll.
   * @internal
   */
  watch(scrollDirection, (direction: ScrollDirection) => {
    if (!isClientHeightChanging) {
      emit('scroll:direction-change', direction);
    }
  });

  /**
   * Resets the scroll position.
   *
   * @internal
   */
  const $x = use$x();
  $x.on(props.resetOn as XEvent, true).subscribe(() => {
    nextTick().then(() => {
      if (props.resetOnChange) {
        $el.scrollTo({ top: 0 });
      }
    });
  });

  return { throttledStoreScrollData };
}
