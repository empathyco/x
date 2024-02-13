import { computed, ComputedRef } from 'vue';
import { Dictionary } from '@empathyco/x-utils';
import { ExtractState, XModuleName } from '../x-modules/x-modules.types';
import { useStore } from './use-store';

/**
 * Function which returns the selected state as a dictionary of paths.
 *
 * @param module - The {@link XModuleName} of the getter.
 * @param paths - List of state paths.
 * @returns The state properties of the module.
 *
 * @public
 */
export function useState<Module extends XModuleName, Path extends keyof ExtractState<Module>>(
  module: Module,
  paths: Path[]
): Dictionary<ComputedRef<Path[]>> {
  const store = useStore();

  return paths.reduce<Dictionary<ComputedRef<Path[]>>>((state, path) => {
    state[path as string] = computed(() => store.state.x[module][path]);
    return state;
  }, {});
}
