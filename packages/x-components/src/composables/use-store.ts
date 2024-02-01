import { computed, ComputedRef, getCurrentInstance } from 'vue';
import { Store } from 'vuex';
import { ExtractState, XModuleName } from '../x-modules/x-modules.types';

/**
 * Function which returns the `$store` object from the current component instance
 * and the selected state.
 *
 * @param module - The {@link XModuleName} of the getter.
 * @param path - The state path.
 * @returns The state properties of the module and the `$store`.
 *
 * @public
 */
export function useStore<Module extends XModuleName, Path extends keyof ExtractState<Module>>(
  module?: Module,
  path?: Path
): UseStore<Module, Path> {
  const store = (getCurrentInstance()?.proxy as { $store: Store<any> }).$store;
  const state = computed(() => store.state.x[module][path]);
  return {
    store,
    state
  };
}

/**
 * Return type of the {@link useStore} composable.
 */
type UseStore<Module extends XModuleName, Path extends keyof ExtractState<Module>> = {
  store: Store<any>;
  state: ComputedRef<ExtractState<Module>[Path]>;
};
