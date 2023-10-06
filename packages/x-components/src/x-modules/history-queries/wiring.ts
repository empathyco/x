import {
  namespacedWireCommit,
  namespacedWireDispatch,
  namespacedWireDispatchWithoutPayload
} from '../../wiring/namespaced-wires.factory';
import { namespacedDebounce } from '../../wiring/namespaced-wires.operators';
import { NamespacedWireCommit, NamespacedWireDispatch } from '../../wiring/namespaced-wiring.types';
import { createWiring } from '../../wiring/wiring.utils';

/**
 * `historyQueries` {@link XModuleName | XModule name}.
 *
 * @internal
 */
const moduleName = 'historyQueries';
/**
 * WireCommit for {@link HistoryQueriesXModule}.
 *
 * @internal
 */
const wireCommit: NamespacedWireCommit<typeof moduleName> = namespacedWireCommit(moduleName);
/**
 * WireDispatch for {@link HistoryQueriesXModule}.
 *
 * @internal
 */
const wireDispatch: NamespacedWireDispatch<typeof moduleName> = namespacedWireDispatch(moduleName);
/**
 * WireDispatchWithoutPayload for {@link HistoryQueriesXModule}.
 *
 * @internal
 */
const wireDispatchWithoutPayload = namespacedWireDispatchWithoutPayload(moduleName);

/**
 * Saves a new query into the history queries.
 *
 * @public
 */
export const addQueryToHistoryQueries = wireDispatch('addQueryToHistory');

/**
 * Saves the selectedQueryPreview query into the history queries.
 *
 * @public
 */
export const addQueryToHistoryQueriesFromPreview = wireDispatch(
  'addQueryToHistory',
  ({ eventPayload: { query } }) => query
);

/**
 * Sets the query of the history queries module. Used for searching into the history queries.
 *
 * @public
 */
export const setHistoryQueriesQuery = wireCommit('setQuery');

/**
 * Sets the query of the history queries module from a selectedQueryPreview's query.
 * Used for searching into the history queries.
 *
 * @public
 */
export const setHistoryQueriesQueryFromPreview = wireCommit(
  'setQuery',
  ({ eventPayload: { query } }) => query
);

/**
 * Sets the history queries state `query` from url.
 *
 * @public
 */
const setUrlParams = wireDispatch('setUrlParams');

/**
 * Sets the query of the history queries module to an empty string.
 *
 * @public
 */
export const clearHistoryQueriesQuery = wireCommit('setQuery', '');

/**
 * Triggers a session refresh, extending its validity for the time configured in the
 * {@link HistoryQueriesConfig.sessionTTLInMs}.
 *
 * @public
 */
export const refreshHistoryQueriesSession = wireDispatchWithoutPayload('refreshSession');

/**
 * Loads the history queries from the browser storage, saving them to the
 * {@link HistoryQueriesState.historyQueries}.
 *
 * @public
 */
export const loadHistoryQueriesFromBrowserStorageWire = wireDispatchWithoutPayload(
  'loadHistoryQueriesFromBrowserStorage'
);

/**
 * Clears the history queries.
 *
 * @public
 */
export const clearHistoryQueries = wireDispatch('setHistoryQueries', []);

/**
 * Removes a single history query from the history queries.
 *
 * @public
 */
export const removeHistoryQuery = wireDispatch('removeFromHistory');

/**
 * Enables history queries.
 *
 * @public
 */
export const setHistoryQueriesEnabled = wireDispatch('toggleHistoryQueries', true);

/**
 * Disables history queries.
 *
 * @public
 */
export const setHistoryQueriesDisabled = wireDispatch('toggleHistoryQueries', false);

/**
 * Updates the history queries with the relevant info included in a search response.
 *
 * @public
 */
export const updateHistoryQueriesWithSearchResponse = wireDispatch(
  'updateHistoryQueriesWithSearchResponse'
);

/**
 * Sets the history queries state `filters` with a selectedHistoryQuery's filters.
 *
 * @public
 */
export const setSearchSelectedFilters = wireCommit(
  'setSearchSelectedFilters',
  ({ eventPayload: { filters } }) => filters
);
/**
 * Debounce function for the module.
 */
const moduleDebounce = namespacedDebounce(moduleName);

/**
 * Default wiring for the {@link HistoryQueries} module.
 *
 * @internal
 */
export const historyQueriesWiring = createWiring({
  ParamsLoadedFromUrl: {
    setUrlParams
  },
  HistoryQueriesQueryChanged: {
    refreshHistoryQueriesSession
  },
  HistoryQueriesStorageKeyChanged: {
    loadHistoryQueriesFromBrowserStorageWire
  },
  UserClearedQuery: {
    clearHistoryQueriesQuery
  },
  UserAcceptedAQuery: {
    setHistoryQueriesQuery,
    addQueryToHistoryQueries
  },
  UserSelectedAHistoryQuery: {
    setSearchSelectedFilters
  },
  UserIsTypingAQuery: {
    setHistoryQueriesQueryDebounce: moduleDebounce(
      setHistoryQueriesQuery,
      ({ state }) => state.config.debounceInMs,
      { cancelOn: 'UserAcceptedAQuery' }
    )
  },
  UserPressedClearHistoryQueries: {
    clearHistoryQueries
  },
  UserPressedRemoveHistoryQuery: {
    removeHistoryQuery
  },
  UserClickedEnableHistoryQueries: {
    setHistoryQueriesEnabled
  },
  UserClickedConfirmDisableHistoryQueries: {
    setHistoryQueriesDisabled
  },
  UserClickedCloseX: {
    clearHistoryQueriesQuery
  },
  UserClickedOutOfMainModal: {
    clearHistoryQueriesQuery
  },
  SearchResponseChanged: {
    updateHistoryQueriesWithSearchResponse
  },
  UserAcceptedAQueryPreview: {
    setHistoryQueriesQueryFromPreview,
    addQueryToHistoryQueriesFromPreview
  }
});
