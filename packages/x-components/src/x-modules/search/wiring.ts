import {
  namespacedWireCommit,
  namespacedWireDispatchWithoutPayload
} from '../../wiring/namespaced-wires.factory';
import { createWiring } from '../../wiring/wiring.utils';

/**
 * `search` {@link XModuleName | XModule name}.
 *
 * @internal
 */
const moduleName = 'search';
/**
 * WireCommit for {@link SearchXModule}.
 *
 * @internal
 */
const wireCommit = namespacedWireCommit(moduleName);

/**
 * WireDispatchWithoutPayload for {@link SearchXModule}.
 *
 * @internal
 */
const wireDispatchWithoutPayload = namespacedWireDispatchWithoutPayload(moduleName);

/**
 * Sets the search state `query`.
 *
 * @public
 */
export const setSearchQuery = wireCommit('setQuery');

/**
 * Resets the search state `spellcheckedQuery` to its initial value, an empty string.
 *
 * @public
 */
export const resetSpellcheckQuery = wireCommit('setSpellcheck', '');

/**
 * Sets the search state `relatedTags`.
 *
 * @public
 */
export const setRelatedTags = wireCommit('setRelatedTags');

/**
 * Sets the search state `selectedFilters`.
 *
 * @public
 */
export const setSelectedFilters = wireCommit('setSelectedFilters');

/**
 * Requests and stores the search response.
 *
 * @public
 */
export const fetchAndSaveSearchResponseWire = wireDispatchWithoutPayload(
  'fetchAndSaveSearchResponse'
);

/**
 * Cancels the {@link SearchActions.fetchAndSaveSearchResponse} request promise.
 *
 * @public
 */
export const cancelFetchAndSaveSearchResponseWire = wireDispatchWithoutPayload(
  'cancelFetchAndSaveSearchResponse'
);

/**
 * Search wiring.
 *
 * @internal
 */
export const searchWiring = createWiring({
  UserAcceptedAQuery: {
    setSearchQuery
  },
  UserAcceptedSpellcheckQuery: {
    resetSpellcheckQuery
  },
  UserClearedQuery: {
    setSearchQuery,
    cancelFetchAndSaveSearchResponseWire
  },
  SearchRequestChanged: {
    fetchAndSaveSearchResponseWire
  },
  SelectedRelatedTagsChanged: {
    setRelatedTags
  },
  SelectedFiltersChanged: {
    setSelectedFilters
  }
});
