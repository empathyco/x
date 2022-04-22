import { DeepPartial } from '@empathyco/x-utils';
import { Store } from 'vuex';
import { RootXStoreState } from '../../../../store/store.types';
import { resetStoreXModuleState } from '../../../../__tests__/utils';
import { historyQueriesXStoreModule } from '../../store/module';
import { HistoryQueriesState } from '../../store/types';

/**
 * Reset history queries x-module state with its original state and the partial state passes as
 * parameter.
 *
 * @param store - Root state of the x-modules.
 * @param state - Partial history queries store state to be replaced.
 *
 * @internal
 */
export function resetXHistoryQueriesStateWith(
  store: Store<DeepPartial<RootXStoreState>>,
  state?: DeepPartial<HistoryQueriesState>
): void {
  resetStoreXModuleState(store, 'historyQueries', historyQueriesXStoreModule.state(), state);
}
