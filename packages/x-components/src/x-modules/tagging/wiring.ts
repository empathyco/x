import { Result, Tagging, TaggingRequest } from '@empathyco/x-types';
import { DefaultSessionService } from '@empathyco/x-utils';
import {
  namespacedWireCommit,
  namespacedWireDispatch
} from '../../wiring/namespaced-wires.factory';
import { namespacedDebounce } from '../../wiring/namespaced-wires.operators';
import { wireService, wireServiceWithoutPayload } from '../../wiring/wires.factory';
import { filter, mapWire } from '../../wiring/wires.operators';
import { Wire } from '../../wiring/wiring.types';
import { createWiring } from '../../wiring/wiring.utils';
import { DefaultPDPAddToCartService } from './service/pdp-add-to-cart.service';

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
 * Wires factory for {@link DefaultPDPAddToCartService}.
 */
const wirePDPAddToCartService = wireService(DefaultPDPAddToCartService.instance);

/**
 * Stores the given result on the local storage.
 *
 * @public
 */
const storeClickedResultWire = wirePDPAddToCartService('storeResultClicked');

/**
 * Moves the result information from the local storage to session storage.
 *
 * @public
 */
const moveClickedResultToSessionWire = mapWire(
  wirePDPAddToCartService('moveToSessionStorage'),
  (payload: string) => {
    return payload === 'url' ? undefined : payload;
  }
);

/**
 * Triggers the add to cart tracking.
 *
 * @public
 */
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
 * Sets the tagging config state.
 *
 * @public
 */
export const setTaggingConfig = wireCommit('setTaggingConfig');

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
function createTrackResultWire(property: keyof Tagging): Wire<Result> {
  return filter(
    wireDispatch('track', ({ eventPayload: { tagging }, metadata: { location } }) => {
      const taggingInfo: TaggingRequest = tagging[property];
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
  ConsentProvided: {
    setConsent
  },
  ConsentChanged: {
    clearSessionWire
  },
  PDPIsLoaded: {
    moveClickedResultToSessionWire
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
  TaggingConfigProvided: {
    setTaggingConfig
  },
  UserClickedAResult: {
    trackResultClickedWire,
    storeClickedResultWire
  },
  UserClickedResultAddToCart: {
    trackAddToCartWire,
    trackResultClickedWire
  },
  UserClickedPDPAddToCart: {
    trackAddToCartFromSessionStorage
  }
});
