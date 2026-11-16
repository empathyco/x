import type { TaggingRequest } from '@empathyco/x-types'
import type { Ref, WatchStopHandle } from 'vue'
import type { WireMetadata } from '../wiring'
import { useElementVisibility } from '@vueuse/core'
import { onMounted, ref, toValue, watch } from 'vue'
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
 * SSR-safe and shadow-DOM-safe way. If no ancestor matches, the ref stays `null`, which makes
 * the visibility be computed against the viewport.
 *
 * @param element - The watched element, used as the lookup starting point.
 * @param scrollTargetId - The id of the element to be used as the visibility root.
 * @returns A ref holding the resolved element (`null` if not found).
 * @internal
 */
function resolveScrollTarget(
  element: HTMLElement | Ref<HTMLElement | null>,
  scrollTargetId: string,
) {
  const scrollTarget = ref<HTMLElement | null>(null)

  onMounted(() => {
    scrollTarget.value = toValue(element)?.closest(`#${CSS.escape(scrollTargetId)}`) ?? null
  })

  return scrollTarget
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
