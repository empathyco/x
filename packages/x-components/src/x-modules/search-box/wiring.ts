import { Dictionary } from '../../utils/types';
import { namespacedWireCommit } from '../../wiring/namespaced-wires.factory';
import { NamespacedWireCommit } from '../../wiring/namespaced-wiring.types';
import { filter, mapWire } from '../../wiring/wires.operators';
import { createWiring } from '../../wiring/wiring.utils';
import { UrlParamValue } from '../url/store/types';

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
 * Sets the search state `sort`.
 *
 * @public
 */
export const setQueryFromUrl = filter(
  mapWire(wireCommit('setQuery'), (payload: Dictionary<UrlParamValue>) => payload.query as string),
  ({ eventPayload}) => !!eventPayload.query
);

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
    setQueryFromUrl
  }
});
