import type { DeepPartial } from '@empathyco/x-utils'
import type { Store } from 'vuex'
import type { IdentifierResultsState } from '../types'
import { resetStoreModuleState } from '../../../../__tests__/utils'
import { identifierResultsXStoreModule } from '../module'

/**
 * Reset identifier results module state with its original state and the partial state passes as
 * parameter.
 *
 * @param store - Identifier results store state.
 * @param state - Partial identifier results store state to be replaced.
 *
 * @internal
 */
export function resetIdentifierResultsStateWith(
  store: Store<IdentifierResultsState>,
  state?: DeepPartial<IdentifierResultsState>,
): void {
  resetStoreModuleState<IdentifierResultsState>(store, identifierResultsXStoreModule.state(), state)
}
