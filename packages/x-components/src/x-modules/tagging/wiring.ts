import { namespacedWireCommit } from '../../wiring/namespaced-wires.factory';
import { wireServiceWithoutPayload } from '../../wiring/wires.factory';
import { createWiring } from '../../wiring/wiring.utils';
import { DefaultSessionService } from './service/session.service';

/**
 * `tagging` {@link XModuleName | XModule name}.
 *
 * @internal
 */
const moduleName = 'tagging';

/**
 * WireCommit for {@link TaggingXModule}.
 *
 * @internal
 */
const wireCommit = namespacedWireCommit(moduleName);

/**
 * Wires without payload factory for {@link DefaultSessionService}.
 */
const wireSessionServiceWithoutPayload = wireServiceWithoutPayload(DefaultSessionService.instance);

/**
 * Clears the session.
 *
 * @public
 */
const clearSessionWire = wireSessionServiceWithoutPayload('clearSessionId');

/**
 * Sets the search state `consent`.
 *
 * @public
 */
export const setConsent = wireCommit('setConsent');

/**
 * Wiring configuration for the {@link TaggingXModule | tagging module}.
 *
 * @internal
 */
export const taggingWiring = createWiring({
  ConsentProvided: {
    setConsent
  },
  ConsentChanged: {
    clearSessionWire
  }
});
