import {
  namespacedWireCommit,
  namespacedWireDispatchWithoutPayload
} from '../../wiring/namespaced-wires.factory';
import { NamespacedWireCommit } from '../../wiring/namespaced-wiring.types';
import { createWiring } from '../../wiring/wiring.utils';

/**
 * `querySuggestions` {@link XModuleName | XModule name}.
 *
 * @internal
 */
const moduleName = 'querySuggestions';
/**
 * WireCommit for {@link QuerySuggestionsXModule}.
 *
 * @internal
 */
const wireCommit: NamespacedWireCommit<typeof moduleName> = namespacedWireCommit(moduleName);
/**
 * WireDispatchWithoutPayload for {@link QuerySuggestionsXModule}.
 *
 * @internal
 */
const wireDispatchWithoutPayload = namespacedWireDispatchWithoutPayload(moduleName);

/**
 * Sets the query-suggestions module query.
 *
 * @public
 */
export const setQuerySuggestionsQuery = wireCommit('setQuery');

/**
 * Clears the query-suggestions module query.
 *
 * @public
 */
export const clearQuerySuggestionsQuery = wireCommit('setQuery', '');

/**
 * Requests and stores a new set of query suggestions for the {@link QuerySuggestionsState.query}.
 *
 * @public
 */
export const getAndSaveSuggestions = wireDispatchWithoutPayload('getAndSaveSuggestions');

/**
 * QuerySuggestions wiring.
 *
 * @internal
 */
export const querySuggestionsWiring = createWiring({
  UserIsTypingAQuery: {
    /* TODO - It has to be debounced but first we should solve an asynchronous issue with
    wireDebounce in the next task https://searchbroker.atlassian.net/browse/EX-1944 */
    setQuerySuggestionsQuery
  },
  UserAcceptedAQuery: {
    setQuerySuggestionsQuery
  },
  UserClearedQuery: {
    clearQuerySuggestionsQuery
  },
  QuerySuggestionsRequestChanged: {
    getAndSaveSuggestions
  }
});
