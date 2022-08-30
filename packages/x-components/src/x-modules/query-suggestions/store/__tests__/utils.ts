import { DeepPartial } from '@empathyco/x-utils';
import { Store } from 'vuex';
import { resetStoreModuleState } from '../../../../__tests__/utils';
import { querySuggestionsXStoreModule } from '../module';
import { QuerySuggestionsState } from '../types';

/**
 * Reset query suggestions module state with its original state and the partial state passes as
 * parameter.
 *
 * @param store - Query suggestions store state.
 * @param state - Partial query suggestions store state to be replaced.
 *
 * @internal
 */
export function resetQuerySuggestionsStateWith(
  store: Store<QuerySuggestionsState>,
  state?: DeepPartial<QuerySuggestionsState>
): void {
  resetStoreModuleState<QuerySuggestionsState>(store, querySuggestionsXStoreModule.state(), state);
}
