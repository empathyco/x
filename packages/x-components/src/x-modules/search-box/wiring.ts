import {
  namespacedWireCommit,
  namespacedWireDispatch
} from '../../wiring/namespaced-wires.factory';
import { NamespacedWireCommit } from '../../wiring/namespaced-wiring.types';
import { createWiring } from '../../wiring/wiring.utils';

/**
 * `searchBox` {@link XModuleName | XModule name}.
 *
 * @internal
 */
const moduleName = 'searchBox';
/**
 * WireCommit for {@link SearchBoxXModule}.
 *
 * @internal
 */
const wireCommit: NamespacedWireCommit<typeof moduleName> = namespacedWireCommit(moduleName);

/**
 * WireDispatch for {@link SearchBoxXModule}.
 *
 * @internal
 */
const wireDispatch = namespacedWireDispatch(moduleName);

/**
 * Sets the query of the search-box module.
 *
 * @public
 */
const setSearchBoxQuery = wireCommit('setQuery');

/**
 * Clears the query of the search-box module.
 *
 * @public
 */
const clearSearchBoxQuery = wireCommit('setQuery', '');

/**
 * Sets the search state `query`.
 *
 * @public
 */
export const setQueryFromUrlAction = wireDispatch('setQueryFromUrl');

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
  },
  ParamsLoadedFromUrl: {
    setQueryFromUrlAction
  }
});
