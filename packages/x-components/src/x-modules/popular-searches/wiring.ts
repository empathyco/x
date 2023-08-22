import {
  namespacedWireCommit,
  namespacedWireDispatch
} from '../../wiring/namespaced-wires.factory';
import { NamespacedWireCommit } from '../../wiring/namespaced-wiring.types';
import { createWiring } from '../../wiring/wiring.utils';

/**
 * `popularSearches` {@link XModuleName | XModule name}.
 *
 * @internal
 */
const moduleName = 'popularSearches';
/**
 * WireDispatchfor {@link PopularSearchesXModule}.
 *
 * @internal
 */
const wireDispatch = namespacedWireDispatch(moduleName);

/**
 * WireCommit for {@link PopularSearchesXModule}.
 *
 * @internal
 */
const wireCommit: NamespacedWireCommit<typeof moduleName> = namespacedWireCommit(moduleName);

/**
 * Requests and stores the popular searches.
 *
 * @public
 */
const retrievePopularSuggestions = wireDispatch('fetchAndSaveSuggestions');

/**
 * Sets the popular searches state `searchedQueries` with the list of history queries.
 *
 * @public
 */
export const setSearchedQueriesInPopularSearches = wireCommit('setSearchedQueries');

/**
 * Sets the popular searches state `params`.
 *
 * @public
 */
export const setPopularSearchesExtraParams = wireCommit('setParams');

/**
 * Sets the popular searches state `params` based on a QueryPreview extraParams.
 *
 * @public
 */
export const setPopularSearchesExtraParamsFromQueryPreview = wireCommit(
  'setParams',
  ({ eventPayload: { extraParams } }) => extraParams
);

/**
 * Wiring configuration for the popular searches modules.
 *
 * @internal
 */
export const popularSearchesWiring = createWiring({
  PopularSearchesRequestUpdated: {
    retrievePopularSuggestions
  },
  SessionHistoryQueriesChanged: {
    setSearchedQueriesInPopularSearches
  },
  ExtraParamsChanged: {
    setPopularSearchesExtraParams
  },
  SelectedQueryPreviewChanged: {
    setPopularSearchesExtraParamsFromQueryPreview
  }
});
