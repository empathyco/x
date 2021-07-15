import { Store } from 'vuex';
import { RootXStoreState } from '../../../../store/store.types';
import { DeepPartial } from '../../../../utils/types';
import { resetStoreXModuleState } from '../../../../__tests__/utils';
import { querySuggestionsXStoreModule } from '../../store/module';
import { QuerySuggestionsState } from '../../store/types';

/**
 * Reset query suggestions x-module state with its original state and the partial state passes as
 * parameter.
 *
 * @param store - Root state of the x-modules.
 * @param state - Query suggestions store state to be replaced.
 *
 * @internal
 */
export function resetXQuerySuggestionsStateWith(
  store: Store<DeepPartial<RootXStoreState>>,
  state?: DeepPartial<QuerySuggestionsState>
): void {
  resetStoreXModuleState(store, 'querySuggestions', querySuggestionsXStoreModule.state(), state);
}
