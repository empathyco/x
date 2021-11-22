import { namespacedDebounce } from '../../wiring';
import {
  namespacedWireCommit,
  namespacedWireDispatch
} from '../../wiring/namespaced-wires.factory';
import { wireServiceWithoutPayload } from '../../wiring/wires.factory';
import { filter } from '../../wiring/wires.operators';
import { createWiring } from '../../wiring/wiring.utils';
import { DefaultSessionService } from './service/session.service';

/**
 * `tagging` {@link XModuleName | XModule name}.
 *
 * @internal
 */
const moduleName = 'tagging';

/**
 * Debounce function for the module.
 */
const moduleDebounce = namespacedDebounce(moduleName);

/**
 * WireCommit for {@link TaggingXModule}.
 *
 * @internal
 */
const wireCommit = namespacedWireCommit(moduleName);

/**
 * WireDispatch for {@link SearchXModule}.
 *
 * @internal
 */
const wireDispatch = namespacedWireDispatch(moduleName);

/**
 * Wires without payload factory for {@link DefaultSessionService}.
 */
const wireSessionServiceWithoutPayload = wireServiceWithoutPayload(DefaultSessionService.instance);

/**
 * Clears the session id.
 *
 * @public
 */
const clearSessionWire = filter(
  wireSessionServiceWithoutPayload('clearSessionId'),
  consent => !consent
);

/**
 * Sets the tagging state `consent`.
 *
 * @public
 */
export const setConsent = wireCommit('setConsent');

/**
 * Sets the tagging state config `queryTaggingDebounceMs`.
 *
 * @public
 */
export const setQueryTaggingDebounce = wireCommit('setQueryTaggingDebounce');

/**
 * Sets the tagging state `sessionTTLMs`.
 *
 * @public
 */
export const setSessionDuration = wireCommit('setSessionDuration');

/**
 * Tracks the tagging of the query using a debounce which ends if the user
 * accepts a query.
 *
 * @public
 */
export const trackTaggingWire = moduleDebounce(
  wireDispatch('track'),
  ({ state }) => state.config.queryTaggingDebounceMs,
  'SearchTaggingChanged'
);

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
  },
  SessionDurationProvided: {
    setSessionDuration
  },
  QueryTaggingDebounceProvided: {
    setQueryTaggingDebounce
  },
  SearchTaggingChanged: {
    trackTaggingAction: trackTaggingWire
  }
});
