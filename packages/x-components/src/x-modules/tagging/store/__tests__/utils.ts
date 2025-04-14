import type { DeepPartial } from '@empathyco/x-utils'
import type { Store } from 'vuex'
import type { TaggingState } from '../types'
import { resetStoreModuleState } from '../../../../__tests__/utils'
import { taggingXStoreModule } from '../module'

/**
 * Reset tagging module state with its original state and the partial state passed as
 * parameter.
 *
 * @param store - Tagging store state.
 * @param state - Partial tagging store state to be replaced.
 *
 * @internal
 */
export function resetTaggingStateWith(
  store: Store<TaggingState>,
  state?: DeepPartial<TaggingState>,
): void {
  resetStoreModuleState<TaggingState>(store, taggingXStoreModule.state(), state)
}
