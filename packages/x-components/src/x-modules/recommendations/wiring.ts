import {
  namespacedWireCommit,
  namespacedWireDispatchWithoutPayload
} from '../../wiring/namespaced-wires.factory';
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
 * WireCommit for {@link RecommendationsXModule}.
 *
 * @internal
 */
const wireCommit = namespacedWireCommit(moduleName);

/**
 * Requests and stores the recommendations.
 *
 * @public
 */
const fetchAndSaveRecommendations = wireDispatchWithoutPayload('fetchAndSaveRecommendations');

/**
 * Sets the recommendations state `params`.
 *
 * @public
 */
export const setRecommendationsExtraParams = wireCommit('setParams');

/**
 * Wiring configuration for the {@link RecommendationsXModule | recommendations module}.
 *
 * @internal
 */
export const recommendationsWiring = createWiring({
  RecommendationsRequestChanged: {
    fetchAndSaveRecommendations
  },
  UserClickedColumnPicker: {},
  ExtraParamsChanged: {
    setRecommendationsExtraParams
  }
});
