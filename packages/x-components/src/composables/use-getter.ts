import { Dictionary } from '@empathyco/x-utils';
import { computed, ComputedRef } from 'vue';
import { ExtractGetters, XModuleName } from '../x-modules/x-modules.types';
import { getGetterPath } from '../plugins/index';
import { useStore } from './use-store';

/**
 * Function which returns the selected getters as a dictionary of getters.
 *
 * @param module - The {@link XModuleName} of the getter.
 * @param getters - List of getters names.
 * @returns The getter properties of the module.
 *
 * @public
 */
export function useGetter<
  Module extends XModuleName,
  GetterName extends keyof ExtractGetters<Module>
>(module: Module, getters: GetterName[]): Dictionary<ComputedRef<GetterName[]>> {
  const store = useStore();

  return getters.reduce<Dictionary<ComputedRef<GetterName[]>>>((getter, getterName) => {
    const getterPath = getGetterPath(module, getterName);
    getter[getterName as string] = computed(() => store.getters[getterPath]);
    return getter;
  }, {});
}
