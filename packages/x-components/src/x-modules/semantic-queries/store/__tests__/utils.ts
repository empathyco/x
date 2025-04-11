import type { DeepPartial } from '@empathyco/x-utils'
import type { Store } from 'vuex'
import type { SemanticQueriesState } from '../types'
import { resetStoreModuleState } from '../../../../__tests__/utils'
import { semanticQueriesXStoreModule } from '../module'

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
  state?: DeepPartial<SemanticQueriesState>,
): void {
  resetStoreModuleState(store, semanticQueriesXStoreModule.state(), state)
}
