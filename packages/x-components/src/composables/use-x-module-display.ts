import type { XModuleName } from '../x-modules/x-modules.types'
import { useElementVisibility } from '@vueuse/core'
import { getCurrentInstance, onBeforeUnmount, onMounted, onUpdated, shallowRef, watch } from 'vue'
import { addXModuleDisplayedConsumer } from '../plugins/x-module-visibility'

/**
 * Composable that tells the {@link XPlugin} when a component of an {@link XModule} is visible in
 * the viewport, so the module requests can be delayed until it is (see the `loadWhenVisible`
 * module config).
 *
 * @remarks
 * The component root element is watched with an `IntersectionObserver`. If the component renders
 * nothing (e.g. a list with no items yet), its closest rendered ancestor is watched instead, so
 * the first request can still be triggered.
 *
 * @param options - The module name and the preload margin.
 * @returns If the component is currently displayed or not.
 * @public
 */
export function useXModuleDisplay({
  moduleName,
  rootMargin = '0px 0px 200px 0px',
}: UseXModuleDisplayOptions) {
  const instance = getCurrentInstance()
  const target = shallowRef<HTMLElement | null>(null)

  function resolveTarget() {
    const el = instance?.proxy?.$el as Node | null | undefined
    target.value = el instanceof HTMLElement ? el : (el?.parentElement ?? null)
  }
  onMounted(resolveTarget)
  onUpdated(resolveTarget)

  const isDisplayed = useElementVisibility(target, { rootMargin, threshold: 0 })

  let removeConsumer: (() => void) | undefined
  watch(
    isDisplayed,
    displayed => {
      if (displayed) {
        removeConsumer ??= addXModuleDisplayedConsumer(moduleName)
      } else {
        removeConsumer?.()
        removeConsumer = undefined
      }
    },
    { immediate: true },
  )
  onBeforeUnmount(() => removeConsumer?.())

  return { isDisplayed }
}

/**
 * Options for the {@link useXModuleDisplay} composable.
 *
 * @public
 */
export interface UseXModuleDisplayOptions {
  /** The module whose requests depend on this component being visible. */
  moduleName: XModuleName
  /** Margin around the viewport used to start requesting before being visible. */
  rootMargin?: string
}
