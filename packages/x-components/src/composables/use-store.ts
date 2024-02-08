import { computed, ComputedRef, getCurrentInstance } from 'vue';
import { Store } from 'vuex';
import { Dictionary } from '@empathyco/x-utils';
import { ExtractState, XModuleName } from '../x-modules/x-modules.types';

/**
 * Function which returns the `$store` object from the current component instance
 * and the selected state as a dictionary of paths.
 *
 * @returns The state properties of the module and the `$store`.
 *
 * @public
 */
export function useStore(): UseStore {
  const store = (getCurrentInstance()?.proxy as { $store: Store<any> }).$store;
  const useState = <Module extends XModuleName, Paths extends keyof ExtractState<Module>>(
    module: Module,
    paths: Paths[]
  ): Dictionary<ComputedRef> => {
    return paths.reduce<Dictionary<ComputedRef>>((state, path) => {
      state[path as string] = computed(() => store.state.x[module][path]);
      return state;
    }, {});
  };
  return {
    store,
    useState
  };
}

/**
 * Return type of the {@link useStore} composable.
 */
type UseStore = {
  store: Store<any>;
  useState: <Module extends XModuleName, Paths extends keyof ExtractState<Module>>(
    module: Module,
    paths: Paths[]
  ) => Dictionary<ComputedRef>;
};
