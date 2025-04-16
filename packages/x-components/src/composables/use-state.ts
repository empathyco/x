import type { ComputedRef } from 'vue'
import type { RootXStoreState } from '../store/store.types'
import type { ExtractState, XModuleName } from '../x-modules/x-modules.types'
import { computed } from 'vue'
import { useStore } from 'vuex'

/**
 * Function which returns the requested state's properties as a dictionary.
 * @param module - The {@link XModuleName} of the getter.
 * @returns A dictionary of computed state properties of the module.
 *
 * @public
 */
export function useState<Module extends XModuleName, State = ExtractState<Module>>(
  module: Module,
): { [P in keyof State]: ComputedRef<State[P]> } {
  const store = useStore<RootXStoreState>()
  return new Proxy({} as { [P in keyof State]: ComputedRef<State[P]> }, {
    get(_obj, path) {
      return computed(() => store?.state.x[module]?.[path as keyof ExtractState<Module>])
    },
  })
}
