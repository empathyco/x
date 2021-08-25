import {
  namespacedWireCommit,
  namespacedWireDispatch,
  namespacedWireDispatchWithoutPayload
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
 * WireDispatchWithoutPayload for {@link NextQueriesXModule}.
 *
 * @internal
 */
const wireDispatchWithoutPayload = namespacedWireDispatchWithoutPayload(moduleName);

/**
 * Sets the next queries state `query`.
 *
 * @public
 */
export const setNextQueriesQuery = wireCommit('setQuery');

/**
 * Sets the related tags state `params`.
 *
 * @public
 */
export const setNextQueriesExtraParams = wireCommit('setParams');

/**
 * Requests and stores the next queries.
 *
 * @public
 */
export const fetchAndSaveNextQueriesWire = wireDispatchWithoutPayload('fetchAndSaveNextQueries');

/**
 * Sets the next queries state `query` with the last query in history queries.
 *
 * @public
 */
export const setQueryFromLastHistoryQueryWire = wireDispatch('setQueryFromLastHistoryQuery');

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
  }
});
