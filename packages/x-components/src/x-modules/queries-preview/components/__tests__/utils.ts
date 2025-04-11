import type { DeepPartial } from '@empathyco/x-utils'
import type { Store } from 'vuex'
import type { RootXStoreState } from '../../../../store/store.types'
import type { QueriesPreviewState } from '../../store/types'
import { resetStoreXModuleState } from '../../../../__tests__/utils'
import { queriesPreviewXStoreModule } from '../../store/module'

/**
 * Reset queries preview x-module state with its original state and the partial state passes as
 * parameter.
 *
 * @param store - Root state of the x-modules.
 * @param state - Partial queries preview store state to be replaced.
 *
 * @internal
 */
export function resetXQueriesPreviewStateWith(
  store: Store<DeepPartial<RootXStoreState>>,
  state?: DeepPartial<QueriesPreviewState>,
): void {
  resetStoreXModuleState(store, 'queriesPreview', queriesPreviewXStoreModule.state(), state)
}
