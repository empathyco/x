import { Dictionary } from '@empathyco/x-utils';
import { computed, ComputedRef } from 'vue';
import { ExtractGetters, XModuleName } from '../x-modules/x-modules.types';
import { getGetterPath } from '../plugins/index';
import { useStore } from './use-store';

/**
 * Function which returns the requested getters as a dictionary of getters.
 *
 * @param module - The {@link XModuleName} of the getter.
 * @param getters - List of getters names.
 * @returns The requested getters from the module.
 *
 * @public
 */
export function useGetter<
  Module extends XModuleName,
  GetterName extends keyof ExtractGetters<Module> & string
>(module: Module, getters: GetterName[]): Dictionary<ComputedRef<GetterName[]>> {
  const store = useStore();

  return getters.reduce<Dictionary<ComputedRef<GetterName[]>>>((getterDictionary, getterName) => {
    const getterPath = getGetterPath(module, getterName);
    getterDictionary[getterName] = computed(() => store.getters[getterPath]);
    return getterDictionary;
  }, {});
}
