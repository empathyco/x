import type { DeepPartial } from '@empathyco/x-utils'
import type { Store } from 'vuex'
import type { RootXStoreState } from '../../../../store/store.types'
import type { QuerySuggestionsState } from '../../store/types'
import { resetStoreXModuleState } from '../../../../__tests__/utils'
import { querySuggestionsXStoreModule } from '../../store/module'

/**
 * Reset query suggestions x-module state with its original state and the partial state passes as
 * parameter.
 *
 * @param store - Root state of the x-modules.
 * @param state - Query suggestions store state to be replaced.
 *
 * @internal
 */
export function resetXQuerySuggestionsStateWith(
  store: Store<DeepPartial<RootXStoreState>>,
  state?: DeepPartial<QuerySuggestionsState>,
): void {
  resetStoreXModuleState(store, 'querySuggestions', querySuggestionsXStoreModule.state(), state)
}
