import type { DeepPartial } from '@empathyco/x-utils'
import type { Store } from 'vuex'
import type { PopularSearchesState } from '../types'
import { resetStoreModuleState } from '../../../../__tests__/utils'
import { popularSearchesXStoreModule } from '../module'

/**
 * Reset popular searches module state with its original state and the partial state passes as
 * parameter.
 *
 * @param store - Popular searches store state.
 * @param state - Partial popular searches store state to be replaced.
 *
 * @internal
 */
export function resetPopularSearchesStateWith(
  store: Store<PopularSearchesState>,
  state?: DeepPartial<PopularSearchesState>,
): void {
  resetStoreModuleState<PopularSearchesState>(store, popularSearchesXStoreModule.state(), state)
}
