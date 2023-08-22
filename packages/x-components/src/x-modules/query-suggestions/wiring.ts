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
 * Sets the query-suggestions state `query` but this query comes from a selected query preview.
 *
 * @public
 */
export const setQuerySuggestionsQueryFromQueryPreview = wireCommit(
  'setQuery',
  ({ eventPayload: { query } }) => query
);

/**
 * Sets the query suggestions state `params`.
 *
 * @public
 */
export const setQuerySuggestionsExtraParams = wireCommit('setParams');

/**
 * Sets the query-suggestions `params` but these are provided from the selected query preview.
 *
 * @public
 */
export const setQuerySuggestionsExtraParamsFromQueryPreview = wireCommit(
  'setParams',
  ({ eventPayload: { extraParams } }) => extraParams
);

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
      { cancelOn: ['UserAcceptedAQuery', 'UserAcceptedAQueryPreview'] }
    )
  },
  UserAcceptedAQuery: {
    setQuerySuggestionsQuery
  },
  UserClearedQuery: {
    clearQuerySuggestionsQuery,
    cancelFetchAndSaveSuggestionsWire
  },
  QuerySuggestionsRequestUpdated: {
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
  },
  UserAcceptedAQueryPreview: {
    setQuerySuggestionsQueryFromQueryPreview,
    setQuerySuggestionsExtraParamsFromQueryPreview
  }
});
