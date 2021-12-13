import { Result } from '@empathyco/x-types';
import { mapWire, filter } from '../../wiring/wires.operators';
import { namespacedDebounce } from '../../wiring/namespaced-wires.operators';
import { Wire } from '../../wiring/wiring.types';
import {
  namespacedWireCommit,
  namespacedWireDispatch
} from '../../wiring/namespaced-wires.factory';
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
 * WireDispatch for {@link TaggingXModule}.
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
  ({ eventPayload: consent }) => !consent
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
export const trackQueryWire = moduleDebounce(
  wireDispatch('track'),
  ({ state }) => state.config.queryTaggingDebounceMs,
  { cancelOn: 'UserClearedQuery' }
);

/**
 * Tracks the tagging of the result.
 *
 * @public
 */
export const trackResultClickedWire = createTrackResultWire('click');

/**
 * Performs a track of a result added to the cart.
 *
 * @public
 */
export const trackAddToCartWire = createTrackResultWire('add2cart');

/**
 * Factory helper to create a wire for the track of a result.
 *
 * @param property - Key of the tagging object to track.
 * @returns A new wire for the given property of the result tagging.
 *
 * @internal
 */
function createTrackResultWire(property: keyof Result['tagging']): Wire<Result> {
  return filter(
    mapWire(wireDispatch('track'), ({ tagging }) => tagging[property]!),
    ({ eventPayload: { tagging } }) => !!tagging?.[property]
  );
}

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
    trackQueryWire
  },
  UserClickedAResult: {
    trackResultClickedWire
  },
  UserClickedResultAddToCart: {
    trackAddToCartWire
  }
});
