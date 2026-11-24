import type { Dictionary } from '@empathyco/x-utils'
import type { Pinia } from 'pinia'
import type { XModuleName } from '../../x-modules/x-modules.types'
import { deepMerge } from '@empathyco/x-utils'
import { defineStore } from 'pinia'

/**
 * Names of the Pinia actions that are exposed through Vuex. It can be an array of names, which are
 * exposed with the same name, or a dictionary where the key is the Vuex name and the value the name
 * of the Pinia action.
 *
 * @internal
 */
export type XStoreBridgeNames = string[] | Dictionary<string>

/**
 * Describes which Pinia actions are exposed as Vuex mutations (`commit`) and as Vuex actions
 * (`dispatch`).
 *
 * @internal
 */
export interface XStoreBridgeDefinition {
  mutations?: XStoreBridgeNames
  actions?: XStoreBridgeNames
}

/**
 * Normalized version of {@link XStoreBridgeDefinition}, where each Vuex name is mapped to its
 * Pinia action name.
 *
 * @internal
 */
export interface XStoreBridge {
  mutations: Dictionary<string>
  actions: Dictionary<string>
}

/**
 * Definition of the Pinia store of an {@link XModule}. It follows the Pinia option store style.
 * Getters receive the state and the getters of the same store, but never the root ones.
 *
 * @internal
 */
export interface XStoreDefinitionInput<State extends Dictionary = any> {
  state: () => State
  getters?: Dictionary<(state: State, getters: any) => unknown>
  actions?: Dictionary<(this: any, ...args: any[]) => unknown>
  bridge?: XStoreBridgeDefinition
}

/**
 * Pure descriptor of the Pinia store of an {@link XModule}. No Pinia store is created until
 * {@link useXStore} is called.
 *
 * @internal
 */
export interface XStoreDefinition<State extends Dictionary = any> {
  name: XModuleName
  id: string
  state: () => State
  getters?: Dictionary<(state: State, getters: any) => unknown>
  actions?: Dictionary<(this: any, ...args: any[]) => unknown>
  bridge: XStoreBridge
}

/**
 * Alias for any {@link XStoreDefinition}.
 *
 * @internal
 */
export type AnyXStoreDefinition = XStoreDefinition

/**
 * Any Pinia store created from an {@link XStoreDefinition}.
 *
 * @internal
 */
export interface AnyPiniaStore {
  $id: string
  $state: Dictionary
  $reset: () => void
  $patch: (mutator: (state: Dictionary) => void) => void
  $dispose: () => void
  [getterOrAction: string]: unknown
}

/**
 * Options to customize the state of a Pinia store created with {@link useXStore}.
 *
 * @internal
 */
export interface UseXStoreOptions {
  /** Partial state that overrides the default one. */
  stateOverride?: Dictionary
  /** The config of the module. It is merged on top of the `config` property of the state. */
  config?: unknown
}

/**
 * Defines the Pinia store of an {@link XModule}. It does not create the store, it only returns a
 * descriptor that can be later used to create it with {@link useXStore}.
 *
 * @param name - The name of the {@link XModule}.
 * @param definition - The state, getters, actions and bridge of the store.
 * @returns The descriptor of the store.
 * @internal
 */
export function defineXStore<State extends Dictionary>(
  name: XModuleName,
  definition: XStoreDefinitionInput<State>,
): XStoreDefinition<State> {
  return {
    name,
    id: `x/${name}`,
    state: definition.state,
    getters: definition.getters,
    actions: definition.actions,
    bridge: {
      mutations: normalizeBridgeNames(definition.bridge?.mutations),
      actions: normalizeBridgeNames(definition.bridge?.actions),
    },
  }
}

/**
 * Creates (or retrieves if it already exists) the Pinia store of the definition, using always the
 * Pinia instance passed. The state is recalculated every time Pinia asks for it, so `$reset` keeps
 * the customization.
 *
 * @param definition - The descriptor of the store.
 * @param pinia - The Pinia instance where the store lives. It does not need to be installed in an
 * app.
 * @param options - The state customization.
 * @returns The Pinia store.
 * @internal
 */
export function useXStore(
  definition: AnyXStoreDefinition,
  pinia: Pinia,
  { stateOverride, config }: UseXStoreOptions = {},
): AnyPiniaStore {
  const getters = Object.fromEntries(
    Object.entries(definition.getters ?? {}).map(([getterName, getter]) => [
      getterName,
      function (this: unknown, state: unknown) {
        return getter(state, this)
      },
    ]),
  )
  const useStore = defineStore(definition.id, {
    // eslint-disable-next-line ts/no-unsafe-return
    state: () => deepMerge(definition.state(), stateOverride, config ? { config } : {}),
    getters,
    actions: definition.actions,
  })
  return useStore(pinia) as unknown as AnyPiniaStore
}

/**
 * Gets the names of the getters of a definition.
 *
 * @param definition - The descriptor of the store.
 * @returns The names of the getters.
 * @internal
 */
export function getXStoreGetterNames(definition: AnyXStoreDefinition): string[] {
  return Object.keys(definition.getters ?? {})
}

/**
 * Normalizes the names of the bridge into a dictionary.
 *
 * @param names - The names as an array or as a dictionary.
 * @returns A dictionary where the key is the Vuex name, and the value the Pinia action name.
 * @internal
 */
function normalizeBridgeNames(names: XStoreBridgeNames = []): Dictionary<string> {
  return Array.isArray(names) ? Object.fromEntries(names.map(name => [name, name])) : { ...names }
}
