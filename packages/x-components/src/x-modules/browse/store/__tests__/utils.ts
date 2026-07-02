import type { DeepPartial } from '@empathyco/x-utils'
import type { Store } from 'vuex'
import type { BrowseState } from '../types'
import { resetStoreModuleState } from '../../../../__tests__/utils'
import { browseXStoreModule } from '../module'

/**
 * Reset browse module state with its original state and the partial state passes as
 * parameter.
 *
 * @param store - Browse store state.
 * @param state - Partial browse store state to be replaced.
 *
 * @internal
 */
export function resetBrowseStateWith(
  store: Store<BrowseState>,
  state?: DeepPartial<BrowseState>,
): void {
  resetStoreModuleState<BrowseState>(store, browseXStoreModule.state(), state)
}
