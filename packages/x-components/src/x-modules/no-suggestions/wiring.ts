import { withModule } from '../../wiring/wires.namespace';
import { createWiring } from '../../wiring/wiring.utils';

/**
 * NoSuggestions wires factory.
 *
 * @public
 */
export const noSuggestionsModule = withModule('noSuggestions');

/**
 * Sets the no-suggestions module query.
 *
 * @public
 */
export const setNoSuggestionsQuery = noSuggestionsModule.wireCommit('setQuery');

/**
 * Sets the query of the no suggestions module to an empty string.
 *
 * @public
 */
export const clearNoSuggestionsQuery = noSuggestionsModule.wireCommit('setQuery', '');

/**
 * NoSuggestions wiring.
 *
 * @internal
 */
export const noSuggestionsWiring = createWiring({
  UserIsTypingAQuery: {
    setNoSuggestionsQuery
  },
  UserAcceptedAQuery: {
    setNoSuggestionsQuery
  },
  UserClearedQuery: {
    clearNoSuggestionsQuery
  }
});
