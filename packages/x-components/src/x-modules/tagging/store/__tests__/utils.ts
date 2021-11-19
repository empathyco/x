import { Store } from 'vuex';
import { resetStoreModuleState } from '../../../../__tests__/utils';
import { DeepPartial } from '../../../../utils';
import { taggingXStoreModule } from '../module';
import { TaggingState } from '../types';

/**
 * Reset tagging module state with its original state and the partial state passes as
 * parameter.
 *
 * @param store - Tagging store state.
 * @param state - Partial tagging store state to be replaced.
 *
 * @internal
 */
export function resetTaggingStateWith(
  store: Store<TaggingState>,
  state?: DeepPartial<TaggingState>
): void {
  resetStoreModuleState<TaggingState>(store, taggingXStoreModule.state(), state);
}
