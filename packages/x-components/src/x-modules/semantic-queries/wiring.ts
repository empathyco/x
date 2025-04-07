import {
  namespacedWireCommit,
  namespacedWireDispatch
} from '../../wiring/namespaced-wires.factory';
import { createWiring } from '../../wiring/wiring.utils';
import { mapWire } from '../../wiring/wires.operators';
import { SearchXEvents } from '../search/events.types';
import { ExtractMutationPayload } from '../../store/store.types';

/**
 * `semanticQueries` {@link XModuleName | name}.
 *
 * @internal
 */
const moduleName = 'semanticQueries';

/**
 * WireCommit for {@link SemanticQueriesXModule}.
 *
 * @internal
 */
const wireCommit = namespacedWireCommit(moduleName);

/**
 * WireDispatch for {@link SemanticQueriesXModule}.
 *
 * @internal
 */
const wireDispatch = namespacedWireDispatch(moduleName);

/**
 * Requests and stores the semantic query results.
 *
 * @public
 */
export const fetchAndSaveSemanticQueryWire = wireDispatch('fetchAndSaveSemanticQuery');

/**
 * Sets the query.
 *
 * @public
 */
export const setQueryWire = wireCommit('setQuery');

/**
 * Sets the query taking the {@link SearchXEvents.SearchResponseChanged} payload.
 *
 * @public
 */
export const setQueryFromSearchResponseChangedWire = mapWire<
  SearchXEvents['SearchResponseChanged'],
  ExtractMutationPayload<'semanticQueries', 'setQuery'>
>(setQueryWire, ({ request: { query } }) => query);

/**
 * Clears the query.
 *
 * @public
 */
export const clearQueryWire = wireCommit('setQuery', '');

/**
 * Sets the total results.
 *
 * @public
 */
export const setTotalResultsWire = wireCommit('setTotalResults');

/**
 * Sets the related prompts state `relatedTags`.
 *
 * @public
 */
export const setSemanticQueriesRelatedTags = wireCommit('setSemanticQueriesRelatedTags');

/**
 * Sets the total results taking the {@link SearchXEvents.SearchResponseChanged} payload.
 *
 * @public
 */
export const setTotalResultsFromSearchResponseChangedWire = mapWire<
  SearchXEvents['SearchResponseChanged'],
  ExtractMutationPayload<'semanticQueries', 'setTotalResults'>
>(setTotalResultsWire, ({ totalResults }) => totalResults);

/**
 * Sets the semantic queries state `params`.
 *
 * @public
 */
export const setSemanticQueriesExtraParamsWire = wireCommit('setParams');

/**
 * Wiring configuration for the {@link SemanticQueriesXModule | semanticQueries module}.
 *
 * @internal
 */
export const semanticQueriesWiring = createWiring({
  UserClearedQuery: {
    clearQueryWire
  },
  SemanticQueryRequestUpdated: {
    fetchAndSaveSemanticQueryWire
  },
  ExtraParamsChanged: {
    setSemanticQueriesExtraParamsWire
  },
  SearchResponseChanged: {
    setQueryFromSearchResponseChangedWire,
    setTotalResultsFromSearchResponseChangedWire
  },
  SelectedRelatedTagsChanged: {
    setSemanticQueriesRelatedTags
  }
});
