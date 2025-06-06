import type { Ref, SetupContext } from 'vue'
import type { XEvent } from '../../wiring/events.types'
import type { ScrollDirection } from './scroll.types'
import { isArray } from '@empathyco/x-utils'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { use$x } from '../../composables/use-$x'
import { throttle } from '../../utils/throttle'

/**
 * Composable to share Scroll logic.
 *
 * @param props - Composable props.
 * @param context - Component setup context.
 * @param scrollEl - The scrolling container reference.
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
    distanceToBottom: number
    /**
     * Positive vertical distance to still consider that the element is the first one visible.
     * For example, if set to 100, after scrolling 100 pixels, the first rendered element
     * will still be considered the first one.
     */
    firstElementThresholdPx: number
    /**
     * Time duration to ignore the subsequent scroll events after an emission.
     * Higher values will decrease events precision but can prevent performance issues.
     *
     * @public
     */
    throttleMs: number
    /**
     * If true (default), sets the scroll position to the top when certain events are emitted.
     *
     * @public
     */
    resetOnChange: boolean
    /**
     * List of events that should reset the scroll when emitted.
     *
     * @public
     */
    resetOn: XEvent | XEvent[]
  },
  { emit }: SetupContext<any>,
  scrollEl: Ref<HTMLElement | undefined>,
) {
  /**
   * Property for getting the client height of scroll.
   *
   * @internal
   */
  const clientHeight = ref(0)

  /**
   * Property for getting the current position of scroll.
   *
   * @internal
   */
  const currentPosition = ref(0)

  /**
   * Property for getting the previous position of scroll.
   *
   * @internal
   */
  const previousPosition = ref(0)

  /**
   * Property for getting the scroll height.
   *
   * @internal
   */
  const scrollHeight = ref(0)
  /**
   * Flag to know if the property clientHeight is changing or gets the final value.
   *
   * @internal
   */
  const isClientHeightChanging = ref(false)

  /**
   * Property for setting the direction of scroll.
   *
   * @internal
   */
  const scrollDirection: Ref<ScrollDirection> = ref('UP')

  /**
   * Restores the clientHeight flag when clientHeight property stops changing.
   * Also sets a new previous position, before update the current one.
   *
   * @internal
   */
  const restoreClientHeightFlag = (): void => {
    isClientHeightChanging.value = false
    previousPosition.value = currentPosition.value
  }

  const throtteledCall = throttle(restoreClientHeightFlag, 100)

  /**
   * Updates scroll related properties.
   *
   * @internal
   */
  const storeScrollData = () => {
    if (scrollEl.value) {
      scrollHeight.value = scrollEl.value.scrollHeight
      clientHeight.value = scrollEl.value.clientHeight
      currentPosition.value = scrollEl.value.scrollTop
    }
  }

  /**
   * Throttled version of the function that stores the DOM scroll related properties.
   * The duration of the throttle is configured through the `throttleMs` prop passed as parameter.
   *
   * @returns A throttled version of the function to store the scroll data.
   * @internal
   */
  const throttledStoreScrollData = computed(() => throttle(storeScrollData, props.throttleMs))

  /**
   * Returns end position of scroll.
   *
   * @returns A number for knowing end position of scroll.
   * @internal
   */
  const scrollEndPosition = computed(() => scrollHeight.value - clientHeight.value)

  /**
   * Returns distance missing to endPosition position.
   *
   * @returns A number for knowing the distance missing to endPosition position.
   * @internal
   */
  const distanceToEnd = computed(() => scrollEndPosition.value - currentPosition.value)

  /**
   * Returns `true` when there is no more content to scroll.
   *
   * @returns A boolean for knowing if the user scrolls to the end.
   * @internal
   */
  const hasScrollReachedEnd = computed(() => currentPosition.value === scrollEndPosition.value)

  /**
   * Returns `true` when the scroll is at the initial position.
   *
   * @returns A boolean for knowing if the user scrolls to the start.
   * @internal
   */
  const hasScrollReachedStart = computed(() => currentPosition.value === 0)

  /**
   * Returns `true` when the amount of pixels scrolled is greater than
   * the `distanceToBottom` prop passed as parameter.
   *
   * @returns A boolean for knowing if the user is about to reaching to the end.
   * @internal
   */
  const hasScrollAlmostReachedEnd = computed(
    () => !hasScrollReachedStart.value && props.distanceToBottom > distanceToEnd.value,
  )

  onMounted(() => {
    // eslint-disable-next-line ts/no-floating-promises
    nextTick().then(() => {
      if (!scrollEl.value) {
        console.warn(
          '[useScroll]',
          'Components using this composable must pass `scrollEl` as the HTML node that is scrolling.',
        )
      } else {
        storeScrollData()
      }
    })
  })

  /**
   * Change the isClientHeightChanging flag when the property clientHeight is changing and
   * calls throttleledCall method.
   *
   * @internal
   */
  watch(
    clientHeight,
    () => {
      isClientHeightChanging.value = true

      throtteledCall()
    },
    { immediate: true },
  )

  /**
   * Emits the `scroll` event.
   *
   * @param _newScrollPosition - The new position of scroll.
   * @param oldScrollPosition - The old position of scroll.
   * @internal
   */
  watch(currentPosition, (_newScrollPosition: number, oldScrollPosition: number) => {
    emit('scroll', currentPosition.value)
    previousPosition.value = oldScrollPosition
  })

  /**
   * Sets direction of scroll based in {@link ScrollDirection} when the current position
   * has changed.
   *
   * @internal
   */
  watch(currentPosition, () => {
    if (!isClientHeightChanging.value && currentPosition.value !== previousPosition.value) {
      scrollDirection.value = currentPosition.value > previousPosition.value ? 'DOWN' : 'UP'
    }
  })

  /**
   * Emits the 'scroll:almost-at-end' event when the user is about to reach to end.
   *
   * @param isScrollAlmostAtEnd - For knowing if the user is about to reach to end.
   * @internal
   */
  watch(hasScrollReachedStart, (isScrollAtStart: boolean) => {
    emit('scroll:at-start', isScrollAtStart)
  })

  /**
   * Sets direction of scroll based in {@link ScrollDirection} when the current position
   * has changed.
   *
   * @internal
   */
  watch(hasScrollAlmostReachedEnd, (isScrollAlmostAtEnd: boolean) => {
    emit('scroll:almost-at-end', isScrollAlmostAtEnd)
  })

  /**
   * Emits the 'scroll:at-end' event when the user reaches the end.
   *
   * @param isScrollAtEnd - For knowing if the user reaches at end.
   * @internal
   */
  watch(hasScrollReachedEnd, (isScrollAtEnd: boolean) => {
    emit('scroll:at-end', isScrollAtEnd)
  })

  /**
   * Emits the `scroll:direction-change` event when the scrolling direction has changed.
   *
   * @param direction - The new direction of scroll.
   * @internal
   */
  watch(scrollDirection, (direction: ScrollDirection) => {
    if (!isClientHeightChanging.value) {
      emit('scroll:direction-change', direction)
    }
  })

  /**
   * Resets the scroll position.
   *
   * @internal
   */
  const $x = use$x()
  const resetOnEvents = isArray(props.resetOn) ? props.resetOn : [props.resetOn]
  resetOnEvents.forEach(event =>
    // eslint-disable-next-line ts/no-misused-promises
    $x.on(event, false).subscribe(async () =>
      nextTick().then(() => {
        if (props.resetOnChange) {
          scrollEl.value?.scrollTo({ top: 0 })
        }
      }),
    ),
  )

  return { throttledStoreScrollData }
}
