import type { TaggingRequest } from '@empathyco/x-types'
import type { Ref, WatchStopHandle } from 'vue'
import type { WireMetadata } from '../wiring'
import { useElementVisibility } from '@vueuse/core'
import { onBeforeUnmount, onMounted, ref, toValue, watch } from 'vue'
import { useXBus } from './use-x-bus'

/**
 * Composable that triggers a callback whenever the provided element appears in the viewport.
 * It can trigger the first time only or every time the element appears in the viewport.
 *
 * @param options - The options to customize the behavior of the composable. The element that
 * will be watched, the callback to trigger and if the callback should be triggered only once
 * or every time the element appears in the viewport, true by default.
 * @returns If the element is currently visible in the viewport or not and the watcher stop handle.
 * @public
 */
export function useOnDisplay({
  element,
  callback,
  triggerOnce = true,
  threshold = 0.1,
  rootMargin,
  scrollContainerAsRoot = false,
}: UseOnDisplayOptions): UseOnDisplayReturn {
  const isElementVisible = useElementVisibility(element, {
    threshold,
    ...(rootMargin !== undefined && { rootMargin }),
    ...(scrollContainerAsRoot && { scrollTarget: useNearestScrollContainer(element) }),
  })

  const unwatchDisplay = watch(isElementVisible, newValue => {
    if (newValue) {
      callback()
      if (triggerOnce) {
        unwatchDisplay()
      }
    }
  })

  return {
    isElementVisible,
    unwatchDisplay,
  }
}

/**
 * Resolves, on mount, the nearest ancestor of the watched element that is scrolling its content,
 * in an SSR-safe and shadow-DOM-safe way. It is `null` when there is none, which makes the
 * visibility be computed against the viewport (the window scrolls).
 *
 * Only an ancestor whose content actually overflows it counts: one that grows with its content
 * (e.g. `MainScroll` with `useWindow`, or a layout that only limits its height in some states)
 * contains every child inside its box, so using it as root would flag all of them as visible.
 *
 * Every ancestor is observed with a `ResizeObserver`, so the root is resolved again when the
 * layout changes which element scrolls.
 *
 * @param element - The watched element.
 * @returns A ref holding the nearest scroll container (`null` for the viewport).
 * @internal
 */
function useNearestScrollContainer(element: HTMLElement | Ref<HTMLElement | null>) {
  const scrollContainer = ref<HTMLElement | null>(null)
  let resizeObserver: ResizeObserver | undefined

  function updateScrollContainer() {
    scrollContainer.value =
      getAncestors(toValue(element)).find(ancestor => isScrollContainer(ancestor)) ?? null
  }

  onMounted(() => {
    updateScrollContainer()
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(updateScrollContainer)
      getAncestors(toValue(element)).forEach(ancestor => resizeObserver!.observe(ancestor))
    }
  })

  onBeforeUnmount(() => resizeObserver?.disconnect())

  return scrollContainer
}

/**
 * Gets the ancestors of an element, from the closest one, crossing shadow roots and stopping
 * before the document `body`, as the document scroll is the viewport.
 *
 * @param element - The element to get the ancestors of.
 * @returns The list of ancestors.
 * @internal
 */
function getAncestors(element: HTMLElement | null) {
  const ancestors: HTMLElement[] = []
  let ancestor = element && getParent(element)
  while (
    ancestor &&
    ancestor !== ancestor.ownerDocument.body &&
    ancestor !== ancestor.ownerDocument.documentElement
  ) {
    ancestors.push(ancestor)
    ancestor = getParent(ancestor)
  }
  return ancestors
}

/**
 * Gets the parent of an element, or the host of its shadow root if it is the root's top element.
 *
 * @param element - The element to get the parent of.
 * @returns The parent element, or `null` if there is none.
 * @internal
 */
function getParent(element: HTMLElement) {
  const root = element.getRootNode()
  return element.parentElement ?? (root instanceof ShadowRoot ? (root.host as HTMLElement) : null)
}

/**
 * Checks if the element is scrolling its content vertically, so it is a meaningful
 * `IntersectionObserver` root.
 *
 * @param element - The element to check.
 * @returns True if the element can scroll and its content is taller than its box.
 * @internal
 */
function isScrollContainer(element: HTMLElement) {
  return (
    ['auto', 'scroll', 'overlay'].includes(getComputedStyle(element).overflowY) &&
    element.scrollHeight > element.clientHeight
  )
}

/**
 * Composable that emits a `TrackableElementDisplayed` event whenever the provided element
 * appears in the viewport for the first time.
 *
 * @param options - The options to customize the behavior of the composable. The element that
 * will be watched and the tagging request to emit.
 * @returns If the element is currently visible in the viewport or not and the watcher stop handle.
 * @public
 */
export function useEmitDisplayEvent({
  element,
  taggingRequest,
  eventMetadata = {},
}: UseEmitDisplayEventOptions): UseOnDisplayReturn {
  const bus = useXBus()

  const { isElementVisible, unwatchDisplay } = useOnDisplay({
    element,
    callback: () => {
      void bus.emit(
        'TrackableElementDisplayed',
        { tagging: { display: taggingRequest } },
        eventMetadata,
      )
    },
  })

  return {
    isElementVisible,
    unwatchDisplay,
  }
}

/**
 * Options for the {@link useOnDisplay} composable.
 */
interface UseOnDisplayOptions {
  element: HTMLElement | Ref<HTMLElement | null>
  callback: () => void
  triggerOnce?: boolean
  threshold?: number
  rootMargin?: string
  /**
   * Computes the visibility against the nearest ancestor that is scrolling the element instead
   * of the viewport, so the `rootMargin` also works inside scroll containers. False by default.
   */
  scrollContainerAsRoot?: boolean
}

/**
 * Return type of the {@link useOnDisplay} composable.
 */
interface UseOnDisplayReturn {
  isElementVisible: Ref<boolean>
  unwatchDisplay: WatchStopHandle
}

/**
 * Options for the {@link useEmitDisplayEvent} composable.
 */
interface UseEmitDisplayEventOptions {
  element: UseOnDisplayOptions['element']
  taggingRequest: TaggingRequest
  eventMetadata?: Omit<WireMetadata, 'moduleName' | 'origin' | 'location'>
}
