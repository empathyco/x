import {
  namespacedWireCommit,
  namespacedWireDispatch,
  namespacedWireDispatchWithoutPayload
} from '../../wiring/namespaced-wires.factory';
import { namespacedDebounce } from '../../wiring/namespaced-wires.operators';
import { NamespacedWireCommit, NamespacedWireDispatch } from '../../wiring/namespaced-wiring.types';
import { createWiring } from '../../wiring/wiring.utils';

/**
 * `identifierResults` {@link XModuleName | XModule name}.
 *
 * @internal
 */
const moduleName = 'identifierResults';
/**
 * WireCommit for {@link IdentifierResultsXModule}.
 *
 * @internal
 */
const wireCommit: NamespacedWireCommit<typeof moduleName> = namespacedWireCommit(moduleName);
/**
 * WireDispatch for {@link IdentifierResultsXModule}.
 *
 * @internal
 */
const wireDispatch: NamespacedWireDispatch<typeof moduleName> = namespacedWireDispatch(moduleName);
/**
 * WireDispatchWithoutPayload for {@link IdentifierResultsXModule}.
 *
 * @internal
 */
const wireDispatchWithoutPayload = namespacedWireDispatchWithoutPayload(moduleName);

/**
 * Sets the identifier-results module query.
 *
 * @public
 */
export const setIdentifierResultsQuery = wireDispatch('saveQuery');

/**
 * Clears the identifier-results module query.
 *
 * @public
 */
export const clearIdentifierResultsQuery = wireCommit('setQuery', '');

/**
 * Requests and stores a new set of identifier results for the {@link IdentifierResultsState.query}.
 *
 * @public
 */
export const fetchAndSaveIdentifierResultsWire = wireDispatch('fetchAndSaveIdentifierResults');

/**
 * Cancels the {@link IdentifierResultsActions.fetchAndSaveIdentifierResults} request promise.
 *
 * @public
 */
export const cancelFetchAndSaveIdentifierResultsWire = wireDispatchWithoutPayload(
  'cancelFetchAndSaveIdentifierResults'
);

/**
 * Debounce function for the module.
 */
const moduleDebounce = namespacedDebounce(moduleName);

/**
 * Default wiring for the {@link IdentifierResultsXModule} module.
 *
 * @internal
 */
export const identifierResultsWiring = createWiring({
  UserIsTypingAQuery: {
    setIdentifierResultsQueryDebounce: moduleDebounce(
      setIdentifierResultsQuery,
      ({ state }) => state.config.debounceInMs,
      'UserAcceptedAQuery'
    )
  },
  UserAcceptedAQuery: {
    setIdentifierResultsQuery
  },
  UserClearedQuery: {
    clearIdentifierResultsQuery,
    cancelFetchAndSaveIdentifierResultsWire
  },
  IdentifierResultsRequestChanged: {
    fetchAndSaveIdentifierResultsWire
  }
});
