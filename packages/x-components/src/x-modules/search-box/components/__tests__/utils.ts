import { Store } from 'vuex';
import { RootXStoreState } from '../../../../store/store.types';
import { DeepPartial } from '../../../../utils/types';
import { resetStoreXModuleState } from '../../../../__tests__/utils';
import { searchBoxXStoreModule } from '../../store/module';
import { SearchBoxState } from '../../store/types';

/**
 * Reset search box x-module state with its original state and the partial state passes as
 * parameter.
 *
 * @param store - Root state of the x-modules.
 * @param state - Search box store state to be replaced.
 *
 * @internal
 */
export function resetXSearchBoxStateWith(
  store: Store<DeepPartial<RootXStoreState>>,
  state?: DeepPartial<SearchBoxState>
): void {
  resetStoreXModuleState(store, 'searchBox', searchBoxXStoreModule.state(), state);
}
