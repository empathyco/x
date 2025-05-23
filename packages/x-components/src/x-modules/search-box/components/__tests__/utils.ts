import type { DeepPartial } from '@empathyco/x-utils'
import type { Store } from 'vuex'
import type { RootXStoreState } from '../../../../store/store.types'
import type { SearchBoxState } from '../../store/types'
import { resetStoreXModuleState } from '../../../../__tests__/utils'
import { searchBoxXStoreModule } from '../../store/module'

/**
 * Reset search box x-module state with its original state and the partial state passes as
 * parameter.
 *
 * @param store - Root state of the x-modules.
 * @param state - Search box store state to be replaced.
 *
 * @internal
 */
export function resetXSearchBoxStateWith(
  store: Store<DeepPartial<RootXStoreState>>,
  state?: DeepPartial<SearchBoxState>,
): void {
  resetStoreXModuleState(store, 'searchBox', searchBoxXStoreModule.state(), state)
}
