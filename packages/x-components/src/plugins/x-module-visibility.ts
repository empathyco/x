import type { XModuleName } from '../x-modules/x-modules.types'
import { reactive } from 'vue'

/**
 * Number of components of each {@link XModule} that are currently displayed.
 *
 * @remarks
 * It is reactive so store emitters can wait for a module to become displayed before emitting.
 *
 * @internal
 */
const displayedConsumers = reactive<Partial<Record<XModuleName, number>>>({})

/**
 * Checks if at least one component of the given module is currently displayed.
 *
 * @param moduleName - The name of the module to check.
 * @returns True if the module has at least one displayed component.
 *
 * @internal
 */
export const isXModuleDisplayed = (moduleName: XModuleName) =>
  (displayedConsumers[moduleName] ?? 0) > 0

/**
 * Registers a displayed component for the given module.
 *
 * @param moduleName - The name of the module the component belongs to.
 * @returns A function that unregisters the component. Calling it more than once has no effect.
 *
 * @internal
 */
export function addXModuleDisplayedConsumer(moduleName: XModuleName) {
  displayedConsumers[moduleName] = (displayedConsumers[moduleName] ?? 0) + 1
  let removed = false
  return () => {
    if (!removed) {
      removed = true
      displayedConsumers[moduleName] = Math.max((displayedConsumers[moduleName] ?? 1) - 1, 0)
    }
  }
}

/**
 * Removes every registered consumer. Intended for tests and for {@link XPlugin.resetInstance}.
 *
 * @internal
 */
export function resetXModulesDisplayedConsumers() {
  Object.keys(displayedConsumers).forEach(moduleName => {
    delete displayedConsumers[moduleName as XModuleName]
  })
}
