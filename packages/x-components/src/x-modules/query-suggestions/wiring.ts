import type { NamespacedWireCommit } from '../../wiring/namespaced-wiring.types'
import {
  namespacedWireCommit,
  namespacedWireDispatch,
  namespacedWireDispatchWithoutPayload,
} from '../../wiring/namespaced-wires.factory'
import { namespacedDebounce } from '../../wiring/namespaced-wires.operators'
import { createWiring } from '../../wiring/wiring.utils'

/**
 * `querySuggestions` {@link XModuleName | XModule name}.
 *
 * @internal
 */
const moduleName = 'querySuggestions'

/**
 * WireCommit for {@link QuerySuggestionsXModule}.
 *
 * @internal
 */
const wireCommit: NamespacedWireCommit<typeof moduleName> = namespacedWireCommit(moduleName)

/**
 * WireDispatchWithoutPayload for {@link QuerySuggestionsXModule}.
 *
 * @internal
 */
const wireDispatchWithoutPayload = namespacedWireDispatchWithoutPayload(moduleName)

/**
 * WireDispatch for {@link QuerySuggestionsXModule}.
 *
 * @internal
 */
const wireDispatch = namespacedWireDispatch(moduleName)

/**
 * Sets the query-suggestions module query.
 *
 * @public
 */
export const setQuerySuggestionsQuery = wireCommit('setQuery')

/**
 * Sets the query-suggestions module query from a selectedQueryPreview's query.
 *
 * @public
 */
export const setQuerySuggestionsQueryFromPreview = wireCommit(
  'setQuery',
  ({ eventPayload: { query } }) => query,
)

/**
 * Sets the query-suggestions module params from a selectedQueryPreview's extraParams.
 *
 * @public
 */
export const setQuerySuggestionsExtraParamsFromPreview = wireCommit(
  'setParams',
  ({ eventPayload: { extraParams } }) => extraParams,
)

/**
 * Sets the query suggestions state `params`.
 *
 * @public
 */
export const setQuerySuggestionsExtraParams = wireCommit('setParams')

/**
 * Sets the query suggestions state `searchedQueries` with the list of history queries.
 *
 * @public
 */
export const setSearchedQueriesInSuggestions = wireCommit('setSearchedQueries')

/**
 * Clears the query-suggestions module query.
 *
 * @public
 */
export const clearQuerySuggestionsQuery = wireCommit('setQuery', '')

/**
 * Clears the query-suggestions module suggestions.
 *
 * @public
 */
export const clearQuerySuggestions = wireCommit('setSuggestions', [])

/**
 * Sets whether the `QuerySuggestions` component is visible in the viewport or not.
 *
 * @public
 */
export const setQuerySuggestionsIsVisible = wireCommit('setIsVisible')

/**
 * Sets the query-suggestions state `query` from url.
 *
 * @public
 */
const setUrlParams = wireDispatch('setUrlParams')

/**
 * Requests and stores a new set of query suggestions for the query.
 *
 * @public
 */
export const fetchAndSaveSuggestionsWire = wireDispatch('fetchAndSaveSuggestions')

/**
 * Cancels the {@link QuerySuggestionsActions.fetchAndSaveSuggestions} request promise.
 *
 * @public
 */
export const cancelFetchAndSaveSuggestionsWire = wireDispatchWithoutPayload(
  'cancelFetchAndSaveSuggestions',
)

/**
 * Debounce function for the module.
 */
const moduleDebounce = namespacedDebounce(moduleName)

/**
 * QuerySuggestions wiring.
 *
 * @internal
 */
export const querySuggestionsWiring = createWiring({
  ParamsLoadedFromUrl: {
    setUrlParams,
  },
  UserIsTypingAQuery: {
    setQuerySuggestionsQueryDebounce: moduleDebounce(
      setQuerySuggestionsQuery,
      ({ state }) => state.config.debounceInMs,
      { cancelOn: 'UserAcceptedAQuery' },
    ),
  },
  UserAcceptedAQuery: {
    setQuerySuggestionsQuery,
  },
  UserClearedQuery: {
    clearQuerySuggestionsQuery,
    cancelFetchAndSaveSuggestionsWire,
    clearQuerySuggestions,
  },
  UserBrowsedToCategory: {
    clearQuerySuggestionsQuery,
    cancelFetchAndSaveSuggestionsWire,
    clearQuerySuggestions,
  },
  QuerySuggestionsRequestUpdated: {
    fetchAndSaveSuggestionsWire,
  },
  QuerySuggestionsVisibilityChanged: {
    setQuerySuggestionsIsVisible,
  },
  ExtraParamsChanged: {
    setQuerySuggestionsExtraParams,
  },
  UserClickedCloseX: {
    clearQuerySuggestionsQuery,
  },
  UserClickedOutOfMainModal: {
    clearQuerySuggestionsQuery,
  },
  UserAcceptedAQueryPreview: {
    setQuerySuggestionsQueryFromPreview,
    setQuerySuggestionsExtraParamsFromPreview,
  },
  QueryPreviewUnselected: {
    setQuerySuggestionsExtraParams,
  },
  SessionHistoryQueriesChanged: {
    setSearchedQueriesInSuggestions,
  },
})
