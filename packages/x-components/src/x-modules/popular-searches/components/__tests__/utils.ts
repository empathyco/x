import { DeepPartial } from '@empathyco/x-utils';
import { Store } from 'vuex';
import { RootXStoreState } from '../../../../store/store.types';
import { resetStoreXModuleState } from '../../../../__tests__/utils';
import { popularSearchesXStoreModule } from '../../store/module';
import { PopularSearchesState } from '../../store/types';

/**
 * Reset popular searches x-module state with its original state and the partial state passes as
 * parameter.
 *
 * @param store - Root state of the x-modules.
 * @param state - Partial popular searches store state to be replaced.
 *
 * @internal
 */
export function resetXPopularSearchesStateWith(
  store: Store<DeepPartial<RootXStoreState>>,
  state?: DeepPartial<PopularSearchesState>
): void {
  resetStoreXModuleState(store, 'popularSearches', popularSearchesXStoreModule.state(), state);
}
