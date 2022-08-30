import { DeepPartial } from '@empathyco/x-utils';
import { Store } from 'vuex';
import { RootXStoreState } from '../../../../store/store.types';
import { resetStoreXModuleState } from '../../../../__tests__/utils';
import { relatedTagsXStoreModule } from '../../store/module';
import { RelatedTagsState } from '../../store/types';

/**
 * Reset related tags x-module state with its original state and the partial state passes as
 * parameter.
 *
 * @param store - Root state of the x-modules.
 * @param state - Partial related tags store state to be replaced.
 *
 * @internal
 */
export function resetStoreRelatedTagsState(
  store: Store<DeepPartial<RootXStoreState>>,
  state?: DeepPartial<RelatedTagsState>
): void {
  resetStoreXModuleState(store, 'relatedTags', relatedTagsXStoreModule.state(), state);
}
