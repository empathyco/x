import type { Dictionary } from '@empathyco/x-utils'
import type { ComputedRef } from 'vue'
import type { RootXStoreState } from '../store/index'
import type { ExtractGetters, XModuleName } from '../x-modules/x-modules.types'
import { computed } from 'vue'
import { useStore } from 'vuex'
import { getGetterPath } from '../plugins/index'

interface UseGetter {
  /** @deprecated Use the single-argument overload instead. */
  <Module extends XModuleName, Getters = keyof ExtractGetters<Module> & string[]>(
    module: Module,
    getters: Getters,
  ): Dictionary<ComputedRef>

  /**
   * Preferred. Use this signature for better type inference and future compatibility.
   */
  <Module extends XModuleName, Getters = ExtractGetters<Module>>(
    module: Module,
  ): { [P in keyof Getters]: ComputedRef<Getters[P]> }
}

/**
 * Function which returns the requested getter's properties as a dictionary.
 *
 * @param module - The {@link XModuleName} of the getter.
 * @returns The requested getters from the module.
 * @public
 */
export const useGetter: UseGetter = function useGetter<
  Module extends XModuleName,
  Getters = ExtractGetters<Module>,
>(module: Module): { [P in keyof Getters]: ComputedRef<Getters[P]> } {
  const store = useStore<RootXStoreState>()
  return new Proxy({} as { [P in keyof Getters]: ComputedRef<Getters[P]> }, {
    get(_obj, getterName) {
      const path = getGetterPath(module, getterName as keyof ExtractGetters<Module>)
      // eslint-disable-next-line ts/no-unsafe-member-access,ts/no-unsafe-return
      return computed(() => store.getters[path as typeof getterName])
    },
  })
}
