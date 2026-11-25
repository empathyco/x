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
  scrollTargetId,
}: UseOnDisplayOptions): UseOnDisplayReturn {
  const isElementVisible = useElementVisibility(element, {
    threshold,
    ...(rootMargin !== undefined && { rootMargin }),
    ...(scrollTargetId !== undefined && {
      scrollTarget: resolveScrollTarget(element, scrollTargetId),
    }),
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
 * Resolves, on mount, the ancestor of the watched element that matches the given id, in an
 * SSR-safe and shadow-DOM-safe way, and uses it as the visibility root only while it is
 * actually clipping its content (it hides its overflow and its content is taller than it).
 *
 * An ancestor that does not clip its content (e.g. `MainScroll` with `useWindow`, or a layout
 * where the container grows with its content) contains every child inside its box, so
 * computing the visibility against it would flag all of them as visible. In those cases the ref
 * is `null`, which makes the visibility be computed against the viewport.
 *
 * The container is observed with a `ResizeObserver`, as the same element can switch between
 * clipping its content and growing with it depending on the layout.
 *
 * @param element - The watched element, used as the lookup starting point.
 * @param scrollTargetId - The id of the element to be used as the visibility root.
 * @returns A ref holding the resolved element (`null` if not found or not clipping its content).
 * @internal
 */
function resolveScrollTarget(
  element: HTMLElement | Ref<HTMLElement | null>,
  scrollTargetId: string,
) {
  const scrollTarget = ref<HTMLElement | null>(null)
  let container: HTMLElement | null = null
  let resizeObserver: ResizeObserver | undefined

  function updateScrollTarget() {
    scrollTarget.value = container && clipsItsContent(container) ? container : null
  }

  onMounted(() => {
    container = toValue(element)?.closest<HTMLElement>(`#${CSS.escape(scrollTargetId)}`) ?? null
    if (!container) {
      return
    }
    updateScrollTarget()
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(updateScrollTarget)
      resizeObserver.observe(container)
    }
  })

  onBeforeUnmount(() => resizeObserver?.disconnect())

  return scrollTarget
}

/**
 * Checks if the element clips its content vertically, which is required for it to be a
 * meaningful `IntersectionObserver` root.
 *
 * @param element - The element to check.
 * @returns True if the element hides its overflow and its content is taller than its box.
 * @internal
 */
function clipsItsContent(element: HTMLElement) {
  return (
    getComputedStyle(element).overflowY !== 'visible' && element.scrollHeight > element.clientHeight
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
  scrollTargetId?: string
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
