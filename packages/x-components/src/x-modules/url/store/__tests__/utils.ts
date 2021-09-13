import Vuex, { Store } from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import { resetStoreModuleState } from '../../../../__tests__/utils';
import { DeepPartial } from '../../../../utils/types';
import { urlXStoreModule } from '../module';
import { UrlState } from '../types';

/**
 * Resets the url module state, optionally modifying its default values.
 *
 * @param store - URL store state.
 * @param state - Partial URL store state to replace the original one.
 *
 * @internal
 */
export function resetUrlStateWith(store: Store<UrlState>, state?: DeepPartial<UrlState>): void {
  resetStoreModuleState(store, urlXStoreModule.state(), state);
}

/**
 * Creates an URL store with the state passed as parameter.
 *
 * @param state - Partial URL store state to replace the original one.
 *
 * @returns Store - The new store created.
 *
 * @internal
 */
export function createUrlStore(state?: Partial<UrlState>): Store<UrlState> {
  const localVue = createLocalVue();
  localVue.config.productionTip = false; // Silent production console messages.
  localVue.use(Vuex);
  const store = new Store<UrlState>(urlXStoreModule as any);
  resetUrlStateWith(store, state);
  return store;
}
