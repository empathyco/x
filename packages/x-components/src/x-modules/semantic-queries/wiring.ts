import {
  namespacedWireCommit,
  namespacedWireDispatch
} from '../../wiring/namespaced-wires.factory';
import { createWiring } from '../../wiring/wiring.utils';
import { mapWire } from '../../wiring/wires.operators';

/**
 * `semanticQueries` {@link XModuleName name}.
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
 * Sets the semantic query.
 *
 * @public
 */
export const setQueryWire = wireCommit('setQuery');

/**
 * Resets the semantic query to an empty one.
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
    setQueryWire: mapWire(setQueryWire, ({ request: { query } }) => query),
    setTotalResultsWire: mapWire(setTotalResultsWire, ({ totalResults }) => totalResults)
  }
});
