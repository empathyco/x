import { SemanticQuery, Taggable, Tagging, TaggingRequest } from '@empathyco/x-types';
import { DefaultSessionService } from '@empathyco/x-utils';
import {
  namespacedWireCommit,
  namespacedWireDispatch
} from '../../wiring/namespaced-wires.factory';
import { namespacedDebounce } from '../../wiring/namespaced-wires.operators';
import { wireService, wireServiceWithoutPayload } from '../../wiring/wires.factory';
import { filter, mapWire } from '../../wiring/wires.operators';
import { DisplayWireMetadata, Wire } from '../../wiring/wiring.types';
import { createWiring } from '../../wiring/wiring.utils';
import { createOrigin } from '../../utils/index';
import { FeatureLocation } from '../../types/index';
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
 * Sets the tagging state `noResultsTaggingEnabled`.
 *
 * @public
 */
export const setNoResultsTaggingEnabledWire = wireCommit('setNoResultsTaggingEnabled');

/**
 * Sets the tagging config state.
 *
 * @public
 */
export const setTaggingConfig = wireCommit('mergeConfig');

/**
 * Tracks the tagging of the query.
 *
 * @public
 */
export const trackQueryWire = filter(
  wireDispatch('track'),
  ({ eventPayload, store }) =>
    (eventPayload as TaggingRequest).params.totalHits > 0 ||
    !store.state.x.tagging.noResultsTaggingEnabled
);

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
 * Sets the tagging state of the query tagging info using.
 *
 * @public
 */
export const setQueryTaggingFromQueryPreview = createSetQueryTaggingFromQueryPreview();

/**
 * Tracks the tagging of the result.
 *
 * @public
 */
export const trackResultClickedWire = createTrackWire('click');

/**
 * Tracks the tagging of the banner.
 *
 * @public
 */
export const trackBannerClickedWire = createTrackWire('click');

/**
 * Performs a track of a result added to the cart.
 *
 * @public
 */
export const trackAddToCartWire = createTrackWire('add2cart');

/**
 * Performs a track of a display result being clicked.
 *
 * @public
 */
export const trackDisplayClickedWire = createTrackDisplayWire('displayClick');

/**
 * Performs a track of a display element appearing.
 *
 * @public
 */
export const trackElementDisplayedWire = createTrackDisplayWire('display');

/**
 * Factory helper to create a wire for the track of a taggable element.
 *
 * @param property - Key of the tagging object to track.
 * @returns A new wire for the given property of the taggable element.
 *
 * @public
 */
export function createTrackWire(property: keyof Tagging): Wire<Taggable> {
  return filter(
    wireDispatch('track', ({ eventPayload: { tagging }, metadata: { location } }) => {
      const taggingInfo: TaggingRequest = tagging[property];
      taggingInfo.params.location = location as string;
      return taggingInfo;
    }),
    ({ eventPayload: { tagging }, metadata: { ignoreInModules } }) =>
      !!tagging?.[property] && !ignoreInModules?.includes(moduleName)
  );
}

/**
 * Performs a track of a query with no results that used semantics as fallback.
 * The totalHits will be changed to -1 if semantic queries are found in order to differentiate
 * it from scenarios where the user encounters a no-results page without any semantic queries.
 *
 * @public
 */
export const trackNoResultsQueryWithSemanticsWire = filter(
  wireDispatch('track', ({ eventPayload, state }) => {
    const { queryTaggingInfo } = state;
    const totalHits = (eventPayload as SemanticQuery[]).length > 0 ? -1 : 0;
    return {
      params: { ...queryTaggingInfo?.params, totalHits },
      url: queryTaggingInfo?.url ?? ''
    };
  }),
  ({ store }) => Number(store.state.x.tagging.queryTaggingInfo?.params.totalHits)! === 0
);

/**.
 * Debounced version of {@link trackNoResultsQueryWithSemanticsWire}
 *
 * @public
 */
export const trackNoResultsQueryWithSemanticsWireDebounced = moduleDebounce(
  trackNoResultsQueryWithSemanticsWire,
  ({ state }) => state.config.queryTaggingDebounceMs
);

/**
 * Factory helper to create a wire for the track of the display click.
 *
 * @param property - Key of the tagging object to track.
 * @returns A new wire for the display click of the taggable element.
 *
 * @public
 */
export function createTrackDisplayWire(property: keyof Tagging): Wire<Taggable> {
  return filter(
    wireDispatch('track', ({ eventPayload: { tagging }, metadata }) => {
      const taggingInfo: TaggingRequest = tagging[property];
      const location = metadata.location as FeatureLocation;

      taggingInfo.params.location = location;
      taggingInfo.params.displayFamily = createOrigin({
        feature: metadata.feature,
        location
      })!;
      taggingInfo.params.q = (metadata as DisplayWireMetadata).displayOriginalQuery;

      return taggingInfo;
    }),
    ({ eventPayload: { tagging } }) => !!tagging?.[property]
  );
}

/**
 * Factory helper to create a wire to set the queryTagging.
 *
 * @returns A new wire for the query of a result of a queryPreview.
 *
 * @public
 */
export function createSetQueryTaggingFromQueryPreview(): Wire<Taggable> {
  return filter(
    wireCommit(
      'setQueryTaggingInfo',
      ({ metadata: { queryTagging } }) => queryTagging as TaggingRequest
    ),
    ({ metadata: { queryTagging } }) => !!queryTagging
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
  TrackableElementDisplayed: {
    trackElementDisplayedWire
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
  },
  UserClickedABanner: {
    trackBannerClickedWire
  },
  UserClickedADisplayResult: {
    trackDisplayClickedWire,
    setQueryTaggingFromQueryPreview
  },
  SemanticQueriesResponseChanged: {
    trackNoResultsQueryWithSemanticsWireDebounced
  },
  ModuleRegistered: {
    setNoResultsTaggingEnabledWire
  }
});
