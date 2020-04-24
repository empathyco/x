import { Store } from 'vuex';
import { RootXStoreState } from '../../../../store/store.types';
import { DeepPartial } from '../../../../utils/types';
import { resetStoreXModuleState } from '../../../../__tests__/utils';
import { nextQueriesXStoreModule } from '../../store/module';
import { NextQueriesState } from '../../store/types';

/**
 * Reset next queries x-module state with its original state and the partial state passes as
 * parameter.
 *
 * @param store - Root state of the x-modules.
 * @param state - Partial next queries store state to be replaced.
 *
 * @internal
 */
export function resetXNextQueriesStateWith(
  store: Store<DeepPartial<RootXStoreState>>,
  state?: DeepPartial<NextQueriesState>
): void {
  resetStoreXModuleState(store, 'nextQueries', nextQueriesXStoreModule.state(), state);
}
