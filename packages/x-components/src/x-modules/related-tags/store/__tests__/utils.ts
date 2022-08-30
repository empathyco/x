import { DeepPartial } from '@empathyco/x-utils';
import { Store } from 'vuex';
import { resetStoreModuleState } from '../../../../__tests__/utils';
import { relatedTagsXStoreModule } from '../module';
import { RelatedTagsState } from '../types';

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
  state?: DeepPartial<RelatedTagsState>
): void {
  resetStoreModuleState<RelatedTagsState>(store, relatedTagsXStoreModule.state(), state);
}
