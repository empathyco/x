import { computed, ComputedRef, getCurrentInstance } from 'vue';
import { Store } from 'vuex';
import { Dictionary } from '@empathyco/x-utils';
import { ExtractState, XModuleName } from '../x-modules/x-modules.types';

/**
 * Function which returns the `$store` object from the current component instance
 * and the selected state as a dictionary of paths.
 *
 * @param module - The {@link XModuleName} of the getter.
 * @returns The state properties of the module and the `$store`.
 *
 * @public
 */
export function useStore<Module extends XModuleName, Path extends keyof ExtractState<Module>>(
  module?: Module
): UseStore<Module, Path> {
  const store = (getCurrentInstance()?.proxy as { $store: Store<any> }).$store;
  const useState = (module: Module, paths: Path[]): ComputedRef<Dictionary<keyof Path>> => {
    return paths.reduce<ComputedRef<Dictionary<keyof Path>>>((state, path) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      state[path] = computed(() => store.state.x[module][path]);
      return state;
    }, {} as ComputedRef<Dictionary<keyof Path>>);
  };
  const useStateWithModule = useState.bind(module);
  return {
    store,
    useState: module ? useStateWithModule : useState
  };
}

/**
 * Return type of the {@link useStore} composable.
 */
type UseStore<Module extends XModuleName, Path extends keyof ExtractState<Module>> = {
  store: Store<any>;
  useState: (module: Module, paths: Path[]) => ComputedRef<Dictionary<keyof Path>>;
};
