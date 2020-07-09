import { namespacedWireDispatchWithoutPayload } from '../../wiring/namespaced-wires.factory';
import { createWiring } from '../../wiring/wiring.utils';

/**
 * `popularSearches` {@link XModuleName | XModule name}.
 *
 * @internal
 */
const moduleName = 'popularSearches';
/**
 * WireDispatchWithoutPayload for {@link PopularSearchesXModule}.
 *
 * @internal
 */
const wireDispatchWithoutPayload = namespacedWireDispatchWithoutPayload(moduleName);

/**
 * Requests and stores the popular searches.
 *
 * @public
 */
const retrievePopularSuggestions = wireDispatchWithoutPayload('getAndSaveSuggestions');

/**
 * Wiring configuration for the popular searches modules.
 *
 * @internal
 */
export const popularSearchesWiring = createWiring({
  PopularSearchesRequestChanged: {
    retrievePopularSuggestions
  }
});
