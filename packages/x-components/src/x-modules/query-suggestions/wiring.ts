import { withModule } from '../../wiring/wires.factory';
import { createWiring } from '../../wiring/wiring.utils';

/**
 * QuerySuggestions wires factory.
 *
 * @public
 */
export const querySuggestionsModule = withModule('querySuggestions');

/**
 * Sets the query suggestions query.
 *
 * @public
 */
export const setQuerySuggestionsQuery = querySuggestionsModule.wireCommit('setQuery');
/**
 * Requests and stores a new set of the query suggestions for the
 * {@link QuerySuggestionsState.query}.
 *
 * @public
 */
export const retrieveQuerySuggestions = querySuggestionsModule.wireDispatchWithoutPayload(
  'retrieveSuggestions'
);

/**
 * QuerySuggestions wiring.
 *
 * @internal
 */
export const querySuggestionsWiring = createWiring({
  UserIsTypingAQuery: {
    setQuerySuggestionsQuery // TODO It should be debounced
  },
  UserAcceptedAQuery: {
    setQuerySuggestionsQuery
  },
  QuerySuggestionsRequestChanged: {
    retrieveQuerySuggestions
  }
});
