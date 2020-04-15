import { withModule } from '../../wiring/wires.factory';
import { debounce } from '../../wiring/wires.operators';
import { createWiring } from '../../wiring/wiring.utils';

/**
 * History queries wires factory.
 *
 * @public
 */
const historyQueriesModule = withModule('historyQueries');

/**
 * Saves a new query into the history queries.
 *
 * @public
 */
export const addQueryToHistoryQueries = historyQueriesModule.wireDispatch('addQueryToHistory');
/**
 * Sets the query of the history queries module. Used for searching into the history queries.
 *
 * @public
 */
export const setHistoryQueriesQuery = historyQueriesModule.wireCommit('setQuery');
/**
 * Sets the query of the history queries module to an empty string.
 *
 * @public
 */
export const clearHistoryQueriesQuery = historyQueriesModule.wireCommit('setQuery', '');
/**
 * Triggers a session refresh, extending its validity for the time configured in the
 * {@link HistoryQueriesConfig.sessionTTLInMs}.
 *
 * @public
 */
export const refreshHistoryQueriesSession = historyQueriesModule.wireDispatchWithoutPayload(
  'refreshSession'
);
/**
 * Loads the history queries from the browser storage, saving them to the
 * {@link HistoryQueriesState.historyQueries}.
 *
 * @public
 */
export const loadHistoryQueriesFromBrowserStorage = historyQueriesModule.wireDispatchWithoutPayload(
  'loadHistoryQueriesFromBrowserStorage'
);
/**
 * Clears the history queries.
 *
 * @public
 */
export const clearHistoryQueries = historyQueriesModule.wireDispatch('setHistoryQueries', []);
/**
 * Removes a single history query from the history queries.
 *
 * @public
 */
export const removeHistoryQuery = historyQueriesModule.wireDispatch('removeFromHistory');

/**
 * Default wiring for the {@link HistoryQueries} module.
 *
 * @internal
 */
export const historyQueriesWiring = createWiring({
  HistoryQueriesQueryChanged: {
    refreshHistoryQueriesSession
  },
  HistoryQueriesStorageKeyChanged: {
    loadHistoryQueriesFromBrowserStorage
  },
  UserPressedClearSearchBoxButton: {
    clearHistoryQueriesQuery
  },
  UserAcceptedAQuery: {
    setHistoryQueriesQuery,
    addQueryToHistoryQueries
  },
  UserIsTypingAQuery: {
    // TODO debounce should come from the config
    setHistoryQueriesQuery: debounce(setHistoryQueriesQuery, 100)
  },
  UserPressedClearHistoryQueries: {
    clearHistoryQueries
  },
  UserPressedRemoveHistoryQuery: {
    removeHistoryQuery
  }
});
