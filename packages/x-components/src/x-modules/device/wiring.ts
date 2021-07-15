import { namespacedWireCommit } from '../../wiring/namespaced-wires.factory';
import { createWiring } from '../../wiring/wiring.utils';

/**
 * WireCommit for {@link DeviceXModule}.
 *
 * @internal
 */
const wireCommit = namespacedWireCommit('device');

/**
 * Sets the device of the {@link DeviceXModule}.
 *
 * @public
 */
export const setName = wireCommit('setName');

/**
 * Wiring configuration for the {@link DeviceXModule | device module}.
 *
 * @internal
 */
export const deviceWiring = createWiring({
  DeviceProvided: {
    setName
  }
});
