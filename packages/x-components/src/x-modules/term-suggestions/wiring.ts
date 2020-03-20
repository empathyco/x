import { withModule } from '../../wiring/wires.factory';
import { createWiring } from '../../wiring/wiring.utils';

/**
 * TermSuggestions wires factory.
 *
 * @public
 */
export const termSuggestionsModule = withModule('termSuggestions');

/**
 * Sets the term suggestions query.
 *
 * @public
 */
export const setTermSuggestionsQuery = termSuggestionsModule.wireCommit('setQuery');
/**
 * Requests and stores a new set of the term suggestions for the {@link TermSuggestionsState.query}.
 *
 * @public
 */
export const retrieveTermSuggestions = termSuggestionsModule.wireDispatchWithoutPayload(
  'retrieveSuggestions'
);

/**
 * TermSuggestions wiring.
 *
 * @internal
 */
export const termSuggestionsWiring = createWiring({
  UserIsTypingAQuery: {
    setTermSuggestionsQuery // TODO It should be debounced
  },
  UserAcceptedAQuery: {
    setTermSuggestionsQuery
  },
  TermSuggestionsRequestChanged: {
    retrieveTermSuggestions
  }
});
