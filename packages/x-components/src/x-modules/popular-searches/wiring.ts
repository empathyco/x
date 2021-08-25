import {
  namespacedWireCommit,
  namespacedWireDispatchWithoutPayload
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
 * WireDispatchWithoutPayload for {@link PopularSearchesXModule}.
 *
 * @internal
 */
const wireDispatchWithoutPayload = namespacedWireDispatchWithoutPayload(moduleName);

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
const retrievePopularSuggestions = wireDispatchWithoutPayload('fetchAndSaveSuggestions');

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
export const setRelatedTagsExtraParams = wireCommit('setParams');

/**
 * Sets empty value to the popular searches state `popularSearches`.
 *
 * @public
 */
export const setSuggestions = wireCommit('setSuggestions', []);

/**
 * Wiring configuration for the popular searches modules.
 *
 * @internal
 */
export const popularSearchesWiring = createWiring({
  PopularSearchesRequestChanged: {
    retrievePopularSuggestions
  },
  SessionHistoryQueriesChanged: {
    setSearchedQueriesInPopularSearches
  },
  ExtraParamsChanged: {
    setRelatedTagsExtraParams,
    setSuggestions
  }
});
