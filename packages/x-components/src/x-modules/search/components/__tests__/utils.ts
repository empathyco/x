import { DeepPartial } from '@empathyco/x-utils';
import { Store } from 'vuex';
import { RootXStoreState } from '../../../../store/store.types';
import { resetStoreXModuleState } from '../../../../__tests__/utils';
import { searchXStoreModule } from '../../store/module';
import { SearchState } from '../../store/types';

/**
 * Reset search x-module state with its original state and the partial state passes as
 * parameter.
 *
 * @param store - Root state of the x-modules.
 * @param state - Search store state to be replaced.
 *
 * @internal
 */
export function resetXSearchStateWith(
  store: Store<DeepPartial<RootXStoreState>>,
  state?: DeepPartial<SearchState>
): void {
  resetStoreXModuleState(store, 'search', searchXStoreModule.state(), state);
}
