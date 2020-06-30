import { withModule } from '../../wiring/wires.namespace';
import { createWiring } from '../../wiring/wiring.utils';

/**
 * IdentifierResults wires factory.
 *
 * @public
 */
export const identifierResultsModule = withModule('identifierResults');

/**
 * Sets the identifier-results module query.
 *
 * @public
 */
export const setIdentifierResultsQuery = identifierResultsModule.wireDispatch('saveQuery');

/**
 * Clears the identifier-results module query.
 *
 * @public
 */
export const clearIdentifierResultsQuery = identifierResultsModule.wireCommit('setQuery', '');

/**
 * Requests and stores a new set of identifier results for the {@link IdentifierResultsState.query}.
 *
 * @public
 */
export const fetchAndSaveIdentifierResultsWire = identifierResultsModule.wireDispatchWithoutPayload(
  'fetchAndSaveIdentifierResults'
);

/**
 * Default wiring for the {@link IdentifierResultsXModule} module.
 *
 * @internal
 */
export const identifierResultsWiring = createWiring({
  UserIsTypingAQuery: {
    /* TODO - It has to be debounced but first we should solve an asynchronous issue with
     wireDebounce in the next task https://searchbroker.atlassian.net/browse/EX-1944 */
    setIdentifierResultsQuery
  },
  UserAcceptedAQuery: {
    setIdentifierResultsQuery
  },
  UserClearedQuery: {
    clearIdentifierResultsQuery
  },
  IdentifierResultsRequestChanged: {
    fetchAndSaveIdentifierResultsWire
  }
});
