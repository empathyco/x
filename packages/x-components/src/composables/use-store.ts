import { getCurrentInstance } from 'vue';
import { Store } from 'vuex';

/**
 * Function which returns the `$store` object from the current component instance.
 *
 * @returns The `$store` object from the current component instance.
 *
 * @public
 */
export function useStore(): Store<any> {
  return (getCurrentInstance()?.proxy as { $store: Store<any> }).$store;
}
