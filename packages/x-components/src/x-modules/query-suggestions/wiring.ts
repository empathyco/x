import { withModule } from '../../wiring/wires.namespace';
import { createWiring } from '../../wiring/wiring.utils';

/**
 * QuerySuggestions wires factory.
 *
 * @public
 */
export const querySuggestionsModule = withModule('querySuggestions');

/**
 * Sets the query-suggestions module query.
 *
 * @public
 */
export const setQuerySuggestionsQuery = querySuggestionsModule.wireCommit('setQuery');

/**
 * Clears the query-suggestions module query.
 *
 * @public
 */
export const clearQuerySuggestionsQuery = querySuggestionsModule.wireCommit('setQuery', '');

/**
 * Requests and stores a new set of query suggestions for the {@link QuerySuggestionsState.query}.
 *
 * @public
 */
export const getAndSaveSuggestions = querySuggestionsModule.wireDispatchWithoutPayload(
  'getAndSaveSuggestions'
);

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
