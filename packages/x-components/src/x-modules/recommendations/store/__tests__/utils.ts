import type { DeepPartial } from '@empathyco/x-utils'
import type { Store } from 'vuex'
import type { RecommendationsState } from '../types'
import { resetStoreModuleState } from '../../../../__tests__/utils'
import { recommendationsXStoreModule } from '../module'

/**
 * Reset recommendations module state with its original state and the partial state passes as
 * parameter.
 *
 * @param store - Recommendations store state.
 * @param state - Recommendations searches store state to be replaced.
 *
 * @internal
 */
export function resetRecommendationsStateWith(
  store: Store<RecommendationsState>,
  state?: DeepPartial<RecommendationsState>,
): void {
  resetStoreModuleState<RecommendationsState>(store, recommendationsXStoreModule.state(), state)
}
