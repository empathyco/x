import { Store } from 'vuex';
import { DeepPartial } from '../../../../utils/types';
import { resetStoreModuleState } from '../../../../__tests__/utils';
import { nextQueriesXStoreModule } from '../module';
import { NextQueriesState } from '../types';

/**
 * Reset next queries module state with its original state and the partial state passes as
 * parameter.
 *
 * @param store - Next queries store state.
 * @param state - Partial next queries store state to be replaced.
 *
 * @internal
 */
export function resetNextQueriesStateWith(
  store: Store<NextQueriesState>,
  state?: DeepPartial<NextQueriesState>
): void {
  resetStoreModuleState<NextQueriesState>(store, nextQueriesXStoreModule.state(), state);
}
