import { Store } from 'vuex';
import { DeepPartial } from '../../../../utils/types';
import { resetStoreModuleState } from '../../../../__tests__/utils';
import { searchBoxXStoreModule } from '../module';
import { SearchBoxState } from '../types';

/**
 * Reset search module state with its original state and the partial state passes as
 * parameter.
 *
 * @param store - Search store state.
 * @param state - Partial search store state to be replaced.
 *
 * @internal
 */
export function resetSearchBoxStateWith(
  store: Store<SearchBoxState>,
  state?: DeepPartial<SearchBoxState>
): void {
  resetStoreModuleState<SearchBoxState>(store, searchBoxXStoreModule.state(), state);
}
