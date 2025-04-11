import type { Dictionary } from '@empathyco/x-utils'
import type { ComputedRef } from 'vue'
import type { ExtractGetters, XModuleName } from '../x-modules/x-modules.types'
import { computed } from 'vue'
import { getGetterPath } from '../plugins/index'
import { useStore } from './use-store'

/**
 * Function which returns the requested getters as a dictionary of getters.
 *
 * @param module - The {@link XModuleName} of the getter.
 * @param getters - List of getters names.
 * @returns The requested getters from the module.
 * @public
 */
export function useGetter<
  Module extends XModuleName,
  GetterName extends keyof ExtractGetters<Module> & string,
>(module: Module, getters: GetterName[]): Dictionary<ComputedRef> {
  const store = useStore()

  return getters.reduce<Dictionary<ComputedRef>>((getterDictionary, getterName) => {
    const getterPath = getGetterPath(module, getterName)
    // eslint-disable-next-line ts/no-unsafe-return,ts/no-unsafe-member-access
    getterDictionary[getterName] = computed(() => store.getters[getterPath])
    return getterDictionary
  }, {})
}
