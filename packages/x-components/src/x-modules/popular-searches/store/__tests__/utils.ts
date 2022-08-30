import { DeepPartial } from '@empathyco/x-utils';
import { Store } from 'vuex';
import { resetStoreModuleState } from '../../../../__tests__/utils';
import { popularSearchesXStoreModule } from '../module';
import { PopularSearchesState } from '../types';

/**
 * Reset popular searches module state with its original state and the partial state passes as
 * parameter.
 *
 * @param store - Popular searches store state.
 * @param state - Partial popular searches store state to be replaced.
 *
 * @internal
 */
export function resetPopularSearchesStateWith(
  store: Store<PopularSearchesState>,
  state?: DeepPartial<PopularSearchesState>
): void {
  resetStoreModuleState<PopularSearchesState>(store, popularSearchesXStoreModule.state(), state);
}
