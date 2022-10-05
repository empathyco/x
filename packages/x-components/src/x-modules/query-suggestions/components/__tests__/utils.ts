import { DeepPartial } from '@empathyco/x-utils';
import { Store } from 'vuex';
import { BooleanFilter, Suggestion } from '@empathyco/x-types';
import { RootXStoreState } from '../../../../store/store.types';
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

/**
 * Loops through the suggestion facets and returns an array with all the filters labels.
 *
 * @param suggestion - Array of suggestions with facets.
 * @returns Array of filter labels.
 */
export function getFlattenFilters(suggestion: Suggestion): string[] {
  const filters: string[] = [];
  suggestion.facets.forEach(facet => {
    for (let i = 0; i < facet.filters.length; i++) {
      filters.push((facet.filters[i] as BooleanFilter).label);
    }
  });
  return filters;
}
