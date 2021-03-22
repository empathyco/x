import { namespacedWireDispatchWithoutPayload } from '../../wiring/namespaced-wires.factory';
import { createWiring } from '../../wiring/wiring.utils';

/**
 * `recommendations` {@link XModuleName | XModule name}.
 *
 * @internal
 */
const moduleName = 'recommendations';
/**
 * WireDispatchWithoutPayload for {@link RecommendationsXModule}.
 *
 * @internal
 */
const wireDispatchWithoutPayload = namespacedWireDispatchWithoutPayload(moduleName);

/**
 * Requests and stores the recommendations.
 *
 * @public
 */
const fetchAndSaveRecommendations = wireDispatchWithoutPayload('fetchAndSaveRecommendations');

/**
 * Wiring configuration for the {@link RecommendationsXModule | recommendations module}.
 *
 * @internal
 */
export const recommendationsWiring = createWiring({
  RecommendationsRequestChanged: {
    fetchAndSaveRecommendations
  },
  UserClickedColumnPicker: {}
});
