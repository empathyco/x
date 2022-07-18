import {
  namespacedWireCommit,
  namespacedWireDispatch
} from '../../wiring/namespaced-wires.factory';
import { NamespacedWireCommit, NamespacedWireDispatch } from '../../wiring/namespaced-wiring.types';
import { createWiring } from '../../wiring/wiring.utils';

/**
 * `nextQueries` {@link XModuleName | XModule name}.
 *
 * @internal
 */
const moduleName = 'nextQueries';
/**
 * WireCommit for {@link NextQueriesXModule}.
 *
 * @internal
 */
const wireCommit: NamespacedWireCommit<typeof moduleName> = namespacedWireCommit(moduleName);
/**
 * WireDispatch for {@link NextQueriesXModule}.
 *
 * @internal
 */
const wireDispatch: NamespacedWireDispatch<typeof moduleName> = namespacedWireDispatch(moduleName);

/**
 * Sets the next queries state `query`.
 *
 * @public
 */
export const setNextQueriesQuery = wireCommit('setQuery');

/**
 * Sets the next queries state `query` from url.
 *
 * @public
 */
const setUrlParams = wireDispatch('setUrlParams');

/**
 * Sets the next queries state `params`.
 *
 * @public
 */
export const setNextQueriesExtraParams = wireCommit('setParams');

/**
 * Requests and stores the next queries.
 *
 * @public
 */
export const fetchAndSaveNextQueriesWire = wireDispatch('fetchAndSaveNextQueries');

/**
 * Sets the next queries state `query` with the last query in history queries.
 *
 * @public
 */
export const setQueryFromLastHistoryQueryWire = wireDispatch('setQueryFromLastHistoryQuery');

export const fetchAndSaveNextQueryPreviewWire = wireDispatch('fetchAndSaveNextQueryPreview');

/**
 * Sets the next queries state `searchedQueries` with the list of history queries.
 *
 * @public
 */
export const setSearchedQueries = wireCommit('setSearchedQueries');

/**
 * Wiring configuration for the {@link NextQueriesXModule | next queries module}.
 *
 * @internal
 */
export const nextQueriesWiring = createWiring({
  ParamsLoadedFromUrl: {
    setUrlParams
  },
  UserAcceptedAQuery: {
    setNextQueriesQuery,
    fetchAndSaveNextQueryPreviewWire
  },
  SessionHistoryQueriesChanged: {
    setSearchedQueries,
    // TODO setQueryFromLastHistoryQuery it has to be called only one time
    setQueryFromLastHistoryQueryWire
  },
  NextQueriesRequestChanged: {
    fetchAndSaveNextQueriesWire
  },
  ExtraParamsChanged: {
    setNextQueriesExtraParams
  }
});
