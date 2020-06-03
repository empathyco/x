import { withModule } from '../../wiring/wires.factory';
import { createWiring } from '../../wiring/wiring.utils';

/**
 * Recommendations wires factory.
 *
 * @public
 */
const recommendationsNamespacedModule = withModule('recommendations');

/**
 * Gets a new set of recommendations and stores them.
 *
 * @public
 */
const fetchAndSaveRecommendations = recommendationsNamespacedModule.wireDispatchWithoutPayload(
  'fetchAndSaveRecommendations'
);

/**
 * Wiring configuration for the {@link RecommendationsXModule | recommendations module}.
 *
 * @internal
 */
export const recommendationsWiring = createWiring({
  RecommendationsRequestChanged: {
    fetchAndSaveRecommendations
  }
});
