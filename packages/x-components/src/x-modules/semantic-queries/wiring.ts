import {
  namespacedWireCommit,
  namespacedWireDispatch
} from '../../wiring/namespaced-wires.factory';
import { createWiring } from '../../wiring/wiring.utils';
import { createWireFromFunction } from '../../wiring/wires.factory';

/**
 * `semanticQueries` {@link XModuleName | XModule name}.
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
 * Clears a semantic query from semantic queries module.
 *
 * @public
 */

export const clearSemanticQueryWire = wireCommit('clearSemanticQuery');

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
  SemanticQueryRequestUpdated: {
    fetchAndSaveSemanticQueryWire
  },
  SemanticQueryUnmountedHook: {
    clearSemanticQueryWire
  },
  ExtraParamsChanged: {
    setSemanticQueriesExtraParamsWire
  },
  SearchResponseChanged: {
    //TODO: extract to a wire
    test: createWireFromFunction(({ eventPayload: searchResponse, store }) => {
      const totalResults = searchResponse.totalResults;
      const query = searchResponse.request.query;

      console.log(searchResponse);

      if (totalResults <= store.state.x.semanticQueries.config.threshold) {
        store.commit('x/semanticQueries/setQuery', query);
      }
    })
  }
});
