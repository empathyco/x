import type { Ref } from 'vue'
import type { XModuleName } from '../x-modules/x-modules.types'
import { onBeforeUnmount, onMounted, watch } from 'vue'
import { setXModuleConsumer, setXModuleElementVisibility } from '../plugins/x-modules-visibility'
import { useOnDisplay } from './use-on-display'

/**
 * Options for the {@link useXModuleVisibility} composable.
 *
 * @public
 */
export interface UseXModuleVisibilityOptions {
  /** The module whose visibility the element reports. */
  moduleName: XModuleName
  /** The element to watch. */
  element: HTMLElement | Ref<HTMLElement | null>
  /** Intersection threshold. Defaults to `0`. */
  threshold?: number
  /** Intersection root margin, useful to preload before the element enters the viewport. */
  rootMargin?: string
  /** Id of the scroll container to be used as the visibility root. */
  scrollTargetId?: string
}

/**
 * Reports the visibility of an element to its {@link XModule}. Store emitters flagged with
 * `emitWhenVisible` are only emitted when one of the module's reporting elements becomes visible.
 *
 * @param options - The module, the element to watch and the intersection options.
 * @returns If the element is currently visible or not.
 * @public
 */
export function useXModuleVisibility({
  moduleName,
  element,
  threshold = 0,
  rootMargin,
  scrollTargetId,
}: UseXModuleVisibilityOptions): { isElementVisible: Ref<boolean> } {
  const token = Symbol(moduleName)

  const { isElementVisible, unwatchDisplay } = useOnDisplay({
    element,
    threshold,
    rootMargin,
    scrollTargetId,
    triggerOnce: false,
    callback: () => {},
  })

  const stopVisibilityWatch = watch(
    isElementVisible,
    isVisible => setXModuleElementVisibility(moduleName, token, isVisible),
    { immediate: true },
  )

  onBeforeUnmount(() => {
    unwatchDisplay()
    stopVisibilityWatch()
    setXModuleElementVisibility(moduleName, token, false)
  })

  return { isElementVisible }
}

/**
 * Registers the current component as a consumer that always needs the data of its
 * {@link XModule} while it is mounted, no matter its visibility. While there is any of these
 * consumers, store emitters flagged with `emitWhenVisible` behave as regular emitters, emitting
 * whenever their value changes.
 *
 * @remarks Useful for renderless components or components without an element to observe.
 *
 * @param moduleName - The module whose data is needed.
 * @public
 */
export function useXModuleDataConsumer(moduleName: XModuleName): void {
  const token = Symbol(moduleName)

  onMounted(() => setXModuleConsumer('always', moduleName, token, true))
  onBeforeUnmount(() => setXModuleConsumer('always', moduleName, token, false))
}
