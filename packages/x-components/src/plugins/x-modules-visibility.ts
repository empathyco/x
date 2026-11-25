import type { EffectScope } from 'vue'
import type { XModuleName } from '../x-modules/x-modules.types'
import { computed, effectScope, reactive } from 'vue'

/**
 * Kind of consumer registered for an {@link XModule}:
 * - `visible`: a component that needs the module data only while it is visible.
 * - `always`: a component that needs the module data as long as it is mounted, no matter its
 * visibility (i.e. renderless components or components that have no element to observe).
 *
 * @internal
 */
export type XModuleConsumerKind = 'visible' | 'always'

/**
 * Registry of the consumers that currently need the data of each {@link XModule}, grouped by kind.
 * Each component registers a unique token while it needs the data, so a module is considered
 * visible (or always needed) as long as at least one of its components is.
 *
 * @internal
 */
const consumersByKind: Record<XModuleConsumerKind, Map<XModuleName, Set<symbol>>> = reactive({
  visible: new Map(),
  always: new Map(),
})

/**
 * Counter of the times any consumer of each {@link XModule} has gone from hidden to visible. It is
 * used to react to every single display, even if another consumer of the module was already
 * visible.
 *
 * @internal
 */
const displaysByModule = reactive(new Map<XModuleName, number>())

/**
 * Creates a reactive counter of the times any consumer of the given module has been displayed.
 *
 * @param moduleName - The name of the module to check.
 * @returns A computed ref with the number of displays of the module consumers.
 * @internal
 */
export function getXModuleDisplaysCount(moduleName: XModuleName) {
  return computed(() => displaysByModule.get(moduleName) ?? 0)
}

/**
 * Registry of the events of each {@link XModule} whose latest value has not been emitted yet
 * because the module data was not needed (see the `emitWhenVisible` store emitter option).
 *
 * @internal
 */
const pendingEventsByModule = reactive(new Map<XModuleName, Set<string>>())

/**
 * Marks an event of the given module as pending (its latest value has not been emitted yet) or not.
 *
 * @param moduleName - The name of the module the event belongs to.
 * @param event - The event name.
 * @param isPending - Whether the event is pending or not.
 * @internal
 */
export function setXModulePendingEvent(
  moduleName: XModuleName,
  event: string,
  isPending: boolean,
): void {
  if (isPending) {
    if (!pendingEventsByModule.has(moduleName)) {
      pendingEventsByModule.set(moduleName, new Set())
    }
    pendingEventsByModule.get(moduleName)!.add(event)
  } else {
    pendingEventsByModule.get(moduleName)?.delete(event)
  }
}

/**
 * Creates a reactive flag telling whether the given module has any event waiting to be emitted
 * until its data is needed. While it is `true`, the module data in the state is outdated.
 *
 * @param moduleName - The name of the module to check.
 * @returns A computed ref which is `true` while the module has any pending event.
 * @public
 */
export function hasXModulePendingEvents(moduleName: XModuleName) {
  return computed(() => (pendingEventsByModule.get(moduleName)?.size ?? 0) > 0)
}

/**
 * Effect scope where the watchers that depend on this registry are created, so they can be
 * stopped all at once when the registry is reset.
 *
 * @internal
 */
let watchersScope: EffectScope = effectScope(true)

/**
 * Runs the given function inside the registry effect scope, so the watchers it creates are
 * stopped when the registry is reset.
 *
 * @param fn - The function to run.
 * @returns The value returned by the function.
 * @internal
 */
export function runInXModulesVisibilityScope<T>(fn: () => T): T {
  return watchersScope.run(fn) as T
}

/**
 * Registers or unregisters a consumer token of the given kind for the given module.
 *
 * @param kind - The kind of consumer.
 * @param moduleName - The name of the module the token belongs to.
 * @param token - Unique identifier of the consumer.
 * @param isActive - Whether the consumer currently needs the data or not.
 * @internal
 */
export function setXModuleConsumer(
  kind: XModuleConsumerKind,
  moduleName: XModuleName,
  token: symbol,
  isActive: boolean,
): void {
  const consumers = consumersByKind[kind]
  if (isActive) {
    if (!consumers.has(moduleName)) {
      consumers.set(moduleName, new Set())
    }
    const tokens = consumers.get(moduleName)!
    if (!tokens.has(token)) {
      tokens.add(token)
      if (kind === 'visible') {
        displaysByModule.set(moduleName, (displaysByModule.get(moduleName) ?? 0) + 1)
      }
    }
  } else {
    consumers.get(moduleName)?.delete(token)
  }
}

/**
 * Marks the given token as visible or hidden for the given module.
 *
 * @param moduleName - The name of the module the token belongs to.
 * @param token - Unique identifier of the element reporting its visibility.
 * @param isVisible - Whether the element is visible or not.
 * @internal
 */
export function setXModuleElementVisibility(
  moduleName: XModuleName,
  token: symbol,
  isVisible: boolean,
): void {
  setXModuleConsumer('visible', moduleName, token, isVisible)
}

/**
 * Creates a reactive flag telling whether there is any consumer of the given kind for a module.
 *
 * @param kind - The kind of consumer.
 * @param moduleName - The name of the module to check.
 * @returns A computed ref which is `true` while at least one consumer of that kind is registered.
 * @internal
 */
export function hasXModuleConsumer(kind: XModuleConsumerKind, moduleName: XModuleName) {
  return computed(() => (consumersByKind[kind].get(moduleName)?.size ?? 0) > 0)
}

/**
 * Creates a reactive flag telling whether any element of the given module is visible.
 *
 * @param moduleName - The name of the module to check.
 * @returns A computed ref which is `true` while at least one element of the module is visible.
 * @internal
 */
export function isXModuleVisible(moduleName: XModuleName) {
  return hasXModuleConsumer('visible', moduleName)
}

/**
 * Clears the consumers registry and stops the watchers that depend on it. Useful for testing.
 *
 * @internal
 */
export function resetXModulesVisibility(): void {
  watchersScope.stop()
  watchersScope = effectScope(true)
  consumersByKind.visible.clear()
  consumersByKind.always.clear()
  pendingEventsByModule.clear()
  displaysByModule.clear()
}
