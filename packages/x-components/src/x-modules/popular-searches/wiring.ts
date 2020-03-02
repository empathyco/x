import { withModule } from '../../wiring/wires.factory';
import { createWiring } from '../../wiring/wiring.utils';

const popularSearchesNamespacedModule = withModule('popularSearches');

const retrievePopularSuggestions = popularSearchesNamespacedModule.wireDispatchWithoutPayload(
  'retrieveSuggestions'
);

export const popularSearchesWiring = createWiring({
  PopularSearchesRequestChanged: {
    retrievePopularSuggestions
  }
});
