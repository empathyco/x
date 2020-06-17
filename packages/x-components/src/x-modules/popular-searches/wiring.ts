import { withModule } from '../../wiring/wires.namespace';
import { createWiring } from '../../wiring/wiring.utils';

/**
 * Popular searches wires factory.
 *
 * @public
 */
const popularSearchesNamespacedModule = withModule('popularSearches');

/**
 * Gets a new set of popular searches and stores them.
 *
 * @public
 */
const retrievePopularSuggestions = popularSearchesNamespacedModule.wireDispatchWithoutPayload(
  'getAndSaveSuggestions'
);

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
