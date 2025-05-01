import type { DeepPartial } from '@empathyco/x-utils'
import type { Store } from 'vuex'
import type { RelatedTagsState } from '../types'
import { resetStoreModuleState } from '../../../../__tests__/utils'
import { relatedTagsXStoreModule } from '../module'

/**
 * Reset related tags module state with its original state and the partial state passes as
 * parameter.
 *
 * @param store - Related tags store state.
 * @param state - Partial related tags store state to be replaced.
 *
 * @internal
 */
export function resetRelatedTagsStateWith(
  store: Store<RelatedTagsState>,
  state?: DeepPartial<RelatedTagsState>,
): void {
  resetStoreModuleState<RelatedTagsState>(store, relatedTagsXStoreModule.state(), state)
}
