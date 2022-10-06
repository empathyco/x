import {
  namespacedWireCommit,
  namespacedWireCommitWithoutPayload,
  namespacedWireDispatch
} from '../../wiring/namespaced-wires.factory';
import {
  NamespacedWireCommit,
  NamespacedWireCommitWithoutPayload,
  NamespacedWireDispatch,
  NamespacedWiringData
} from '../../wiring/namespaced-wiring.types';
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
 * WireCommitWithoutPayload for {@link NextQueriesXModule}.
 */
const wireCommitWithoutPayload: NamespacedWireCommitWithoutPayload<typeof moduleName> =
  namespacedWireCommitWithoutPayload(moduleName);

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

/**
 * Requests and store the next query preview results.
 *
 * @public
 */
export const fetchAndSaveNextQueryPreviewWire = wireDispatch(
  'fetchAndSaveNextQueryPreview',
  ({ eventPayload: query, metadata: { location } }: NamespacedWiringData<'nextQueries'>) => {
    return {
      query,
      location
    };
  }
);
/**
 * Resets the next query preview results.
 *
 * @public
 */
export const resetResultsPreviewWire = wireCommitWithoutPayload('resetResultsPreview');

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
  NextQueriesChanged: {
    resetResultsPreviewWire
  },
  UserAcceptedAQuery: {
    setNextQueriesQuery
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
  },
  NextQueryPreviewMounted: {
    fetchAndSaveNextQueryPreviewWire
  }
});
