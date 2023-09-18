import { namespacedWireCommitWithoutPayload } from '../../wiring';
import { createWiring } from '../../wiring/wiring.utils';

const moduleName = 'experienceControls';

/**
 * WireCommit for {@link SemanticQueriesXModule}.
 *
 * @internal
 */
const wireCommit = namespacedWireCommitWithoutPayload(moduleName);

/**
 * WireCommit for {@link ExperienceControlsXModule}.
 *
 * @internal
 */
export const setParamsWire = wireCommit('setParams');

/**
 * Wiring configuration for the {@link ExperienceControlsXModule | experience-controls module}.
 *
 * @internal
 */
export const experienceControlsWiring = createWiring({
  ExtraParamsChanged: {
    setParamsWire
  }
});
