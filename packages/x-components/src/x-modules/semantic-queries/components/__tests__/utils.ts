import type { DeepPartial } from '@empathyco/x-utils'
import type { Store } from 'vuex'
import type { RootXStoreState } from '../../../../store/store.types'
import type { SemanticQueriesState } from '../../store/types'
import { resetStoreXModuleState } from '../../../../__tests__/utils'
import { semanticQueriesXStoreModule } from '../../store/module'

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
  state?: DeepPartial<SemanticQueriesState>,
): void {
  resetStoreXModuleState(store, 'semanticQueries', semanticQueriesXStoreModule.state(), state)
}
