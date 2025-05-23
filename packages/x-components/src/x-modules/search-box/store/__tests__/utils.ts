import type { DeepPartial } from '@empathyco/x-utils'
import type { Store } from 'vuex'
import type { SearchBoxState } from '../types'
import { resetStoreModuleState } from '../../../../__tests__/utils'
import { searchBoxXStoreModule } from '../module'

/**
 * Reset search box module state with its original state and the partial state passes as
 * parameter.
 *
 * @param store - Search box store state.
 * @param state - Partial search box store state to be replaced.
 *
 * @internal
 */
export function resetSearchBoxStateWith(
  store: Store<SearchBoxState>,
  state?: DeepPartial<SearchBoxState>,
): void {
  resetStoreModuleState<SearchBoxState>(store, searchBoxXStoreModule.state(), state)
}
