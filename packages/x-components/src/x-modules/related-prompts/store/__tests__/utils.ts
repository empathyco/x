import { DeepPartial } from '@empathyco/x-utils';
import { Store } from 'vuex';
import { resetStoreModuleState } from '../../../../__tests__/utils';
import { relatedPromptsXStoreModule } from '../module';
import { RelatedPromptsState } from '../types';

/**
 * Reset related prompt module state with its original state and the partial state passes as
 * parameter.
 *
 * @param store - Related prompt store state.
 * @param state - Partial related prompt store state to be replaced.
 *
 * @internal
 */
export function resetRelatedPromptsStateWith(
  store: Store<RelatedPromptsState>,
  state?: DeepPartial<RelatedPromptsState>
): void {
  resetStoreModuleState<RelatedPromptsState>(store, relatedPromptsXStoreModule.state(), state);
}
