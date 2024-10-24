import { useStore as useStoreVuex, Store } from 'vuex';
/**
 * Function which returns the `$store` object from the current component instance.
 *
 * @returns The `$store` object from the current component instance.
 *
 * @public
 */
export function useStore(): Store<any> {
  return useStoreVuex();
}
