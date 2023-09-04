import {
  namespacedWireCommit,
  namespacedWireDispatch
} from '../../wiring/namespaced-wires.factory';
import { createWiring } from '../../wiring/wiring.utils';

/**
 * `recommendations` {@link XModuleName | XModule name}.
 *
 * @internal
 */
const moduleName = 'recommendations';
/**
 * WireDispatch for {@link RecommendationsXModule}.
 *
 * @internal
 */
const wireDispatch = namespacedWireDispatch(moduleName);
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
const fetchAndSaveRecommendations = wireDispatch('fetchAndSaveRecommendations');

/**
 * Sets the recommendations state `params`.
 *
 * @public
 */
export const setRecommendationsExtraParams = wireCommit('setParams');

/**
 * Sets the recommendations state `params` from a queryPreview's extraParams.
 *
 * @public
 */
export const setRecommendationsExtraParamsFromQueryPreview = wireCommit(
  'setParams',
  ({ eventPayload: { extraParams } }) => extraParams
);

/**
 * Wiring configuration for the {@link RecommendationsXModule | recommendations module}.
 *
 * @internal
 */
export const recommendationsWiring = createWiring({
  RecommendationsRequestUpdated: {
    fetchAndSaveRecommendations
  },
  UserClickedColumnPicker: {},
  ExtraParamsChanged: {
    setRecommendationsExtraParams
  },
  QueryPreviewUnselected: {
    setRecommendationsExtraParams
  }
});
