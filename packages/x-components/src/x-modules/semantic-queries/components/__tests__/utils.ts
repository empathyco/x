import { Store } from 'vuex';
import { DeepPartial } from '@empathyco/x-utils';
import { SemanticQueriesState } from '../../store/types';
import { semanticQueriesXStoreModule } from '../../store/module';
import { resetStoreXModuleState } from '../../../../__tests__/utils';
import { RootXStoreState } from '../../../../store/store.types';

/**
 * Reset semantic queries x-module state with its original state and the partial state passes as
 * parameter.
 *
 * @param store - Root state of the x-modules.
 * @param state - Partial semantic queries store state to be replaced.
 *
 * @internal
 */
export function resetSemanticQueriesStateWith(
  store: Store<DeepPartial<RootXStoreState>>,
  state?: DeepPartial<SemanticQueriesState>
): void {
  resetStoreXModuleState(store, 'semanticQueries', semanticQueriesXStoreModule.state(), state);
}
