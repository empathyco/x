import { getCurrentInstance } from 'vue';
import { Store } from 'vuex';

/**
 * Function which returns the `$store` object from the current component instance
 * and the selected state as a dictionary of paths.
 *
 * @returns The state properties of the module and the `$store`.
 *
 * @public
 */
export function useStore(): Store<any> {
  return (getCurrentInstance()?.proxy as { $store: Store<any> }).$store;
}
