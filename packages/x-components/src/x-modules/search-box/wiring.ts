import { withModule } from '../../wiring/wires.factory';
import { createWiring } from '../../wiring/wiring.utils';

/**
 * SearchBox wires factory.
 *
 * @public
 */
const searchBoxModule = withModule('searchBox');

/**
 * Sets the query of the search-box module.
 *
 * @public
 */
const setSearchBoxQuery = searchBoxModule.wireCommit('setQuery');

/**
 * Clears the query of the search-box module.
 *
 * @public
 */
const clearSearchBoxQuery = searchBoxModule.wireCommit('setQuery', '');

/**
 * SearchBox wiring.
 *
 * @internal
 */
export const searchBoxWiring = createWiring({
  UserIsTypingAQuery: {
    setSearchBoxQuery
  },
  UserAcceptedAQuery: {
    setSearchBoxQuery
  },
  UserPressedClearSearchBoxButton: {
    clearSearchBoxQuery
  }
});
