import type { DeepPartial } from '@empathyco/x-utils'
import type { Store } from 'vuex'
import type { AiState } from '../types'
import { resetStoreModuleState } from '../../../../__tests__/utils'
import { aiXStoreModule } from '../module'

/**
 * Reset ai module state with its original state and the partial state passed as parameter.
 *
 * @param store - Ai store state.
 * @param state - Partial ai store state to be replaced.
 *
 * @internal
 */
export function resetAiStateWith(store: Store<AiState>, state?: DeepPartial<AiState>): void {
  resetStoreModuleState<AiState>(store, aiXStoreModule.state(), state)
}
