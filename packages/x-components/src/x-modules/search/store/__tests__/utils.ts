import type { DeepPartial } from '@empathyco/x-utils'
import type { Store } from 'vuex'
import type { SearchState } from '../types'
import { resetStoreModuleState } from '../../../../__tests__/utils'
import { searchXStoreModule } from '../module'

/**
 * Reset search module state with its original state and the partial state passes as
 * parameter.
 *
 * @param store - Search store state.
 * @param state - Partial search store state to be replaced.
 *
 * @internal
 */
export function resetSearchStateWith(
  store: Store<SearchState>,
  state?: DeepPartial<SearchState>,
): void {
  resetStoreModuleState<SearchState>(store, searchXStoreModule.state(), state)
}
