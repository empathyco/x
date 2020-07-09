import { namespacedWireCommit } from '../../wiring/namespaced-wires.factory';
import { NamespacedWireCommit } from '../../wiring/namespaced-wiring.types';
import { createWiring } from '../../wiring/wiring.utils';

/**
 * `noSuggestions` {@link XModuleName | XModule name}.
 *
 * @internal
 */
const moduleName = 'noSuggestions';
/**
 * WireCommit for {@link NoSuggestionsXModule}.
 *
 * @internal
 */
const wireCommit: NamespacedWireCommit<typeof moduleName> = namespacedWireCommit(moduleName);

/**
 * Sets the no-suggestions module query.
 *
 * @public
 */
export const setNoSuggestionsQuery = wireCommit('setQuery');

/**
 * Sets the query of the no suggestions module to an empty string.
 *
 * @public
 */
export const clearNoSuggestionsQuery = wireCommit('setQuery', '');

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
