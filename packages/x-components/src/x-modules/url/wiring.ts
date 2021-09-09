import {
  namespacedWireCommit,
  namespacedWireDispatch
} from '../../wiring/namespaced-wires.factory';
import { createWiring } from '../../wiring/wiring.utils';

/**
 * WireCommit for {@link UrlXModule}.
 *
 * @internal
 */
const wireCommit = namespacedWireCommit('url');
const wireDispatch = namespacedWireDispatch('url');

/**
 * Sets the URL config.
 *
 * @public
 */
export const setUrlConfigWire = wireCommit('setUrlConfig');

export const updateStore = wireDispatch('updateStoreFromUrl');

/**
 * Wiring configuration for the {@link UrlXModule | url module}.
 *
 * @internal
 */
export const urlWiring = createWiring({
  UrlConfigProvided: {
    setUrlConfigWire
  },
  EmpathizeOpened: {
    updateStore
  }
});
