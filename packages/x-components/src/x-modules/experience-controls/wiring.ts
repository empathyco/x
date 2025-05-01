import { namespacedWireCommit, namespacedWireDispatch } from '../../wiring/namespaced-wires.factory'
import { createWiring } from '../../wiring/wiring.utils'

const moduleName = 'experienceControls'

/**
 * WireCommit for {@link ExperienceControlsXModule}.
 *
 * @internal
 */
const wireCommit = namespacedWireCommit(moduleName)

/**
 * WireDispatch for {@link ExperienceControlsXModule}.
 *
 * @internal
 */
const wireDispatch = namespacedWireDispatch(moduleName)

/**
 * WireCommit for {@link ExperienceControlsXModule}.
 *
 * @internal
 */
export const setParamsWire = wireCommit('setParams')

/**
 * Requests and stores a new set of controls results.
 *
 * @public
 */
export const fetchAndSaveExperienceControlsWire = wireDispatch(
  'fetchAndSaveExperienceControlsResponse',
)

/**
 * Wiring configuration for the {@link ExperienceControlsXModule | experience-controls module}.
 *
 * @internal
 */
export const experienceControlsWiring = createWiring({
  ExtraParamsChanged: {
    setParamsWire,
  },
  ExperienceControlsRequestUpdated: {
    fetchAndSaveExperienceControlsWire,
  },
})
