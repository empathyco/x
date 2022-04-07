import { DeepPartial } from '@empathyco/x-utils';
import { Store } from 'vuex';
import { resetStoreModuleState } from '../../../../__tests__/utils';
import { historyQueriesXStoreModule } from '../module';
import { HistoryQueriesState } from '../types';

/**
 * Reset history queries module state with its original state and the partial state passes as
 * parameter.
 *
 * @param store - History queries store state.
 * @param state - Partial history queries store state to be replaced.
 *
 * @internal
 */
export function resetHistoryQueriesStateWith(
  store: Store<HistoryQueriesState>,
  state?: DeepPartial<HistoryQueriesState>
): void {
  resetStoreModuleState<HistoryQueriesState>(store, historyQueriesXStoreModule.state(), state);
}
