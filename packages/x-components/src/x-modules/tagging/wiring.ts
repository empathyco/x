import { Result, TaggingInfo } from '@empathyco/x-types';
import {
  namespacedWireCommit,
  namespacedWireDispatch
} from '../../wiring/namespaced-wires.factory';
import { namespacedDebounce } from '../../wiring/namespaced-wires.operators';
import { wireService, wireServiceWithoutPayload } from '../../wiring/wires.factory';
import { filter } from '../../wiring/wires.operators';
import { Wire } from '../../wiring/wiring.types';
import { createWiring } from '../../wiring/wiring.utils';
import { DefaultSessionService } from './service/session.service';
import { DefaultPDPAddToCartService } from './service/index';

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

const wirePDPAddToCartService = wireService(DefaultPDPAddToCartService.instance);

const storeClickedResultWire = wirePDPAddToCartService('storeResultClicked');
const moveClickedResultToSessionWire = wirePDPAddToCartService('moveToSessionStorage');
const trackAddToCartFromSessionStorage = wirePDPAddToCartService('trackAddToCart');

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
 * Sets the tagging state `clickedResultStorageKey`.
 *
 * @public
 */
export const setClickedResultStorageKey = wireCommit('setClickedResultStorageKey');

/**
 * Sets the tagging state `clickedResultStorageTTLMs`.
 *
 * @public
 */
export const setClickedResultStorageTTL = wireCommit('setClickedResultStorageTTL');

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
 * Tracks the tagging of the query.
 *
 * @public
 */
export const trackQueryWire = wireDispatch('track');

/**
 * Sets the tagging state of the query tagging info using a debounce which ends if the user
 * accepts a query.
 *
 * @public
 */
export const setQueryTaggingInfo = moduleDebounce(
  wireCommit('setQueryTaggingInfo'),
  ({ state }) => state.config.queryTaggingDebounceMs,
  {
    cancelOn: 'UserClearedQuery',
    forceOn: [
      'UserClickedAResult',
      'UserClickedAPromoted',
      'UserClickedABanner',
      'UserClickedARedirection',
      'UserReachedResultsListEnd'
    ]
  }
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
    wireDispatch('track', ({ eventPayload: { tagging }, metadata: { location } }) => {
      const taggingInfo: TaggingInfo = tagging[property];
      taggingInfo.params.location = location as string;
      return taggingInfo;
    }),
    ({ eventPayload: { tagging } }) => !!tagging?.[property]
  );
}

/**
 * Wiring configuration for the {@link TaggingXModule | tagging module}.
 *
 * @internal
 */
export const taggingWiring = createWiring({
  ClickedResultStorageKeyProvided: {
    setClickedResultStorageKey
  },
  ClickedResultStorageDurationProvided: {
    setClickedResultStorageTTL
  },
  ConsentProvided: {
    setConsent
  },
  ConsentChanged: {
    clearSessionWire
  },
  PDPIsLoaded: {
    moveClickedResultToSessionWire
  },
  QueryTaggingDebounceProvided: {
    setQueryTaggingDebounce
  },
  ResultURLTrackingEnabled: {
    moveClickedResultToSessionWire
  },
  SearchTaggingChanged: {
    setQueryTaggingInfo
  },
  SearchTaggingReceived: {
    trackQueryWire
  },
  SessionDurationProvided: {
    setSessionDuration
  },
  UserClickedAResult: {
    trackResultClickedWire,
    storeClickedResultWire
  },
  UserClickedResultAddToCart: {
    trackAddToCartWire
  },
  UserClickedPDPAddToCart: {
    trackAddToCartFromSessionStorage
  }
});
