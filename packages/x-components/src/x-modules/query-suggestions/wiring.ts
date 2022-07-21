import {
  namespacedWireCommit,
  namespacedWireDispatch,
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
 * WireDispatch for {@link QuerySuggestionsXModule}.
 *
 * @internal
 */
const wireDispatch = namespacedWireDispatch(moduleName);

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
 * Sets the query-suggestions state `query` from url.
 *
 * @public
 */
const setUrlParams = wireDispatch('setUrlParams');

/**
 * Requests and stores a new set of query suggestions for the {@link QuerySuggestionsState.query}.
 *
 * @public
 */
export const fetchAndSaveSuggestionsWire = wireDispatch('fetchAndSaveSuggestions');

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
  ParamsLoadedFromUrl: {
    setUrlParams
  },
  UserIsTypingAQuery: {
    setQuerySuggestionsQueryDebounce: moduleDebounce(
      setQuerySuggestionsQuery,
      ({ state }) => state.config.debounceInMs,
      { cancelOn: 'UserAcceptedAQuery' }
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
  },
  UserClickedCloseX: {
    clearQuerySuggestionsQuery
  },
  UserClickedOutOfMainModal: {
    clearQuerySuggestionsQuery
  }
});
