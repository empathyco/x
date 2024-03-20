import { computed, ComputedRef } from 'vue';
import { Dictionary } from '@empathyco/x-utils';
import { ExtractState, XModuleName } from '../x-modules/x-modules.types';
import { useStore } from './use-store';

/**
 * Function which returns the requested state's properties as a dictionary.
 *
 * @param module - The {@link XModuleName} of the getter.
 * @param paths - List of state paths.
 * @returns The requested state properties of the module.
 *
 * @public
 */
export function useState<
  Module extends XModuleName,
  Path extends keyof ExtractState<Module> & string
>(module: Module, paths: Path[]): Dictionary<ComputedRef> {
  const store = useStore();

  return paths.reduce<Dictionary<ComputedRef>>((stateDictionary, path) => {
    stateDictionary[path] = computed(() => store.state.x[module]?.[path]);
    return stateDictionary;
  }, {});
}
