import { computed } from 'vue';
import { ExtractState, XModuleName } from '../x-modules/x-modules.types';
import { useStore } from './use-store';

/**
 * Generates a computed property which returns the selected state.
 *
 * @param module - The {@link XModuleName} of the getter.
 * @param path - The state path.
 * @returns The state properties of the module.
 * @public
 */
export function useState<Module extends XModuleName, Path extends keyof ExtractState<Module>>(
  module: Module,
  path: Path
): ExtractState<Module>[Path] {
  const $store = useStore();
  const state = computed((): ExtractState<Module>[Path] => {
    return $store.state.x[module][path];
  });
  return state.value;
}
