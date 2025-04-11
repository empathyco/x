import type { DeepPartial } from '@empathyco/x-utils'
import type { Store } from 'vuex'
import type { RootXStoreState } from '../../../../store/store.types'
import type { NextQueriesState } from '../../store/types'
import { resetStoreXModuleState } from '../../../../__tests__/utils'
import { nextQueriesXStoreModule } from '../../store/module'

/**
 * Reset next queries x-module state with its original state and the partial state passes as
 * parameter.
 *
 * @param store - Root state of the x-modules.
 * @param state - Partial next queries store state to be replaced.
 *
 * @internal
 */
export function resetXNextQueriesStateWith(
  store: Store<DeepPartial<RootXStoreState>>,
  state?: DeepPartial<NextQueriesState>,
): void {
  resetStoreXModuleState(store, 'nextQueries', nextQueriesXStoreModule.state(), state)
}
