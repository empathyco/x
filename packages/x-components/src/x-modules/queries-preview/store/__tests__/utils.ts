import type { DeepPartial } from '@empathyco/x-utils'
import type { Store } from 'vuex'
import type { QueriesPreviewState } from '../types'
import { resetStoreModuleState } from '../../../../__tests__/utils'
import { queriesPreviewXStoreModule } from '../module'

/**
 * Reset queries preview module state with its original state and the partial state passes as
 * parameter.
 *
 * @param store - Queries preview store state.
 * @param state - Partial queries preview store state to be replaced.
 *
 * @internal
 */
export function resetQueriesPreviewStateWith(
  store: Store<QueriesPreviewState>,
  state?: DeepPartial<QueriesPreviewState>,
): void {
  resetStoreModuleState<QueriesPreviewState>(store, queriesPreviewXStoreModule.state(), state)
}
