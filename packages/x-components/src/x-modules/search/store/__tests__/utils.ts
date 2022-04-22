import { DeepPartial } from '@empathyco/x-utils';
import { Store } from 'vuex';
import { resetStoreModuleState } from '../../../../__tests__/utils';
import { searchXStoreModule } from '../module';
import { SearchState } from '../types';

/**
 * Reset search module state with its original state and the partial state passes as
 * parameter.
 *
 * @param store - Search store state.
 * @param state - Partial search store state to be replaced.
 *
 * @internal
 */
export function resetSearchStateWith(
  store: Store<SearchState>,
  state?: DeepPartial<SearchState>
): void {
  resetStoreModuleState<SearchState>(store, searchXStoreModule.state(), state);
}
