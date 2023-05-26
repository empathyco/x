import { Store } from 'vuex';
import { DeepPartial } from '@empathyco/x-utils/src/types/utils.types';
import { SemanticQueriesState } from '../types';
import { resetStoreModuleState } from '../../../../__tests__/utils';
import { semanticQueriesXStoreModule } from '../module';

/**
 * Reset semantic queries module state with its original state and the partial state passes as
 * parameter.
 *
 * @param store - Semantic queries store state.
 * @param state - Partial semantic queries store state to be replaced.
 *
 * @internal
 */
export function resetSemanticQueriesStateWith(
  store: Store<SemanticQueriesState>,
  state?: DeepPartial<SemanticQueriesState>
): void {
  resetStoreModuleState(store, semanticQueriesXStoreModule.state(), state);
}
