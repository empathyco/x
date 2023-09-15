import { wireCommit } from '../../wiring';
import { createWiring } from '../../wiring/wiring.utils';

/**
 * WireCommit for {@link ExperienceControlsXModule}.
 *
 * @internal
 */
export const controlEvents = wireCommit('setControls');

/**
 * Wiring configuration for the {@link ExperienceControlsXModule | experience-controls module}.
 *
 * @internal
 */
export const experienceControlsWiring = createWiring({
  ExperienceControlsClosed: {
    controlEvents
  }
});
