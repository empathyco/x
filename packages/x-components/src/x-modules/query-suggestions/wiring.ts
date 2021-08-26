import {
  namespacedWireCommit,
  namespacedWireDispatchWithoutPayload
} from '../../wiring/namespaced-wires.factory';
import { namespacedDebounce } from '../../wiring/namespaced-wires.operators';
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
 * Sets the query suggestions state `params`.
 *
 * @public
 */
export const setQuerySuggestionsExtraParams = wireCommit('setParams');

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
export const fetchAndSaveSuggestionsWire = wireDispatchWithoutPayload('fetchAndSaveSuggestions');

/**
 * Cancels the {@link QuerySuggestionsActions.fetchAndSaveSuggestions} request promise.
 *
 * @public
 */
export const cancelFetchAndSaveSuggestionsWire = wireDispatchWithoutPayload(
  'cancelFetchAndSaveSuggestions'
);

/**
 * Debounce function for the module.
 */
const moduleDebounce = namespacedDebounce(moduleName);

/**
 * QuerySuggestions wiring.
 *
 * @internal
 */
export const querySuggestionsWiring = createWiring({
  UserIsTypingAQuery: {
    setQuerySuggestionsQueryDebounce: moduleDebounce(
      setQuerySuggestionsQuery,
      ({ state }) => state.config.debounceInMs,
      'UserAcceptedAQuery'
    )
  },
  UserAcceptedAQuery: {
    setQuerySuggestionsQuery
  },
  UserClearedQuery: {
    clearQuerySuggestionsQuery,
    cancelFetchAndSaveSuggestionsWire
  },
  QuerySuggestionsRequestChanged: {
    fetchAndSaveSuggestionsWire
  },
  ExtraParamsChanged: {
    setQuerySuggestionsExtraParams
  }
});
