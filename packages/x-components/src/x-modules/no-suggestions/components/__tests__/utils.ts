import { Store } from 'vuex';
import { RootXStoreState } from '../../../../store/store.types';
import { DeepPartial } from '../../../../utils/types';
import { resetStoreXModuleState } from '../../../../__tests__/utils';
import { noSuggestionsXStoreModule } from '../../store/module';
import { NoSuggestionsState } from '../../store/types';

/**
 * Reset no suggestions x-module state with its original state and the partial state passes as
 * parameter.
 *
 * @param store - Root state of the x-modules.
 * @param state - Partial no suggestions store state to be replaced.
 *
 * @internal
 */
export function resetStoreNoSuggestionsState(
  store: Store<DeepPartial<RootXStoreState>>,
  state?: DeepPartial<NoSuggestionsState>
): void {
  resetStoreXModuleState(store, 'noSuggestions', noSuggestionsXStoreModule.state(), state);
}
