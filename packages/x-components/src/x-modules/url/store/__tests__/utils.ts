import { Store } from 'vuex';
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
