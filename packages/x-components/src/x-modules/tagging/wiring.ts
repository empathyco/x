import type {
  RelatedPrompt,
  Result,
  SemanticQuery,
  Taggable,
  Tagging,
  TaggingRequest,
} from '@empathyco/x-types'
import type { FeatureLocation } from '../../types/index'
import type { DisplayWireMetadata, Wire } from '../../wiring/wiring.types'
import { DefaultSessionService } from '@empathyco/x-utils'
import { createOrigin } from '../../utils/index'
import { namespacedWireCommit, namespacedWireDispatch } from '../../wiring/namespaced-wires.factory'
import { namespacedDebounce } from '../../wiring/namespaced-wires.operators'
import { wireService, wireServiceWithoutPayload } from '../../wiring/wires.factory'
import { filter, filterTruthyPayload, mapWire } from '../../wiring/wires.operators'
import { createWiring } from '../../wiring/wiring.utils'
import { DefaultExternalTaggingService } from './service/external-tagging.service'

/**
 * `tagging` {@link XModuleName | XModule name}.
 *
 * @internal
 */
const moduleName = 'tagging'

/**
 * Debounce function for the module.
 */
const moduleDebounce = namespacedDebounce(moduleName)

/**
 * WireCommit for {@link TaggingXModule}.
 *
 * @internal
 */
const wireCommit = namespacedWireCommit(moduleName)

/**
 * WireDispatch for {@link TaggingXModule}.
 *
 * @internal
 */
const wireDispatch = namespacedWireDispatch(moduleName)

/**
 * Wires without payload factory for {@link DefaultSessionService}.
 */
const wireSessionServiceWithoutPayload = wireServiceWithoutPayload(DefaultSessionService.instance)

/**
 * Wires factory for {@link DefaultExternalTaggingService}.
 */
const wireExternalTaggingService = wireService(DefaultExternalTaggingService.instance)

/**
 * Stores the given result on the local storage.
 *
 * @public
 */
const storeClickedResultWire = wireExternalTaggingService('storeResultClicked')

/**
 * Stores the result added to cart on the local storage.
 *
 * @public
 */
const storeAddToCartWire = wireExternalTaggingService('storeAddToCart')

/**
 * Moves the result information from the local storage to session storage.
 *
 * @public
 */
const moveClickedResultToSessionWire = mapWire(
  wireExternalTaggingService('moveToSessionStorage'),
  (payload: string) => {
    return payload === 'url' ? undefined : payload
  },
)

/**
 * Triggers the add to cart tracking.
 *
 * @public
 */
const trackAddToCartFromSessionStorage = wireExternalTaggingService('trackAddToCart')

/**
 * Clears the session id.
 *
 * @public
 */
const clearSessionWire = filter(
  wireSessionServiceWithoutPayload('clearSessionId'),
  ({ eventPayload: consent }) => !consent,
)

/**
 * Sets the tagging state `consent`.
 *
 * @public
 */
export const setConsent = wireCommit('setConsent')

/**
 * Sets the tagging state `noResultsTaggingEnabled`.
 *
 * @public
 */
export const setNoResultsTaggingEnabledWire = wireCommit('setNoResultsTaggingEnabled')

/**
 * Sets the tagging config state.
 *
 * @public
 */
export const setTaggingConfig = wireCommit('mergeConfig')

/**
 * Tracks the tagging of the query.
 *
 * @public
 */
export const trackQueryWire = filter(
  wireDispatch('track'),
  ({ eventPayload, store }) =>
    ((eventPayload as TaggingRequest).params.totalHits as number) > 0 ||
    !store.state.x.tagging.noResultsTaggingEnabled,
)

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
      'UserReachedResultsListEnd',
    ],
  },
)

/**
 * Sets the tagging state of the query tagging info using.
 *
 * @public
 */
export const setQueryTaggingFromQueryPreview = createSetQueryTaggingFromQueryPreview()

/**
 * Tracks the tagging of the result.
 *
 * @public
 */
export const trackResultClickedWire = createTrackWire('click')

/**
 * Tracks the tagging of the banner.
 *
 * @public
 */
export const trackBannerClickedWire = createTrackWire('click')

/**
 * Tracks the click on a promoted result.
 *
 * @public
 */
export const trackPromotedClickedWire = createTrackWire('click')

/**
 * Performs a track of a result added to the cart.
 *
 * @public
 */
export const trackAddToCartWire = createTrackWire('add2cart')

/**
 * Performs a track of a display result being clicked.
 *
 * @public
 */
export const trackDisplayClickedWire = createTrackDisplayWire('displayClick')

/**
 * Performs a track of a display result being clicked.
 *
 * @public
 */
export const trackToolingDisplayClickedWire = createTrackToolingDisplayWire()

/**
 * Performs a track of a display result being clicked.
 *
 * @public
 */
export const trackToolingAdd2CartWire = createTrackToolingAdd2CartWire()

/**
 * Performs a track of a clicked related prompt.
 *
 * @public
 */
export const trackRelatedPromptToolingDisplayClickWire =
  createTrackRelatedPromptToolingDisplayClickWire()

/**
 * Performs a track of a display element appearing.
 *
 * @public
 */
export const trackElementDisplayedWire = createTrackDisplayWire('display')

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
      const taggingInfo: TaggingRequest = tagging[property]
      taggingInfo.params.location = location as string
      return taggingInfo
    }),
    ({ eventPayload: { tagging }, metadata: { ignoreInModules } }) =>
      // eslint-disable-next-line ts/no-unsafe-member-access
      !!tagging?.[property] && !ignoreInModules?.includes(moduleName),
  )
}

/**
 * Performs a track of a query with no results that used related prompts or semantic queries as fallback.
 * The totalHits will be changed to -1 if related prompts or semantic queries are found in order to differentiate
 * it from scenarios where the user encounters a no-results page without any related prompts or semantic queries.
 *
 * @public
 */
export const trackNoResultsQueryWithFallbackWire = filter(
  wireDispatch('track', ({ eventPayload, state }) => {
    const { queryTaggingInfo } = state
    const totalHits = (eventPayload as RelatedPrompt[] | SemanticQuery[]).length > 0 ? -1 : 0
    return {
      params: { ...queryTaggingInfo?.params, totalHits },
      url: queryTaggingInfo?.url ?? '',
    }
  }),
  ({ store }) => Number(store.state.x.tagging.queryTaggingInfo?.params.totalHits) === 0,
)

/**.
 * Debounced version of {@link trackNoResultsQueryWithFallbackWire}
 *
 * @public
 */
export const trackNoResultsQueryWithFallbackWireDebounced = moduleDebounce(
  trackNoResultsQueryWithFallbackWire,
  ({ state }) => state.config.queryTaggingDebounceMs,
  { cancelOn: ['QueryPreviewUnmounted', 'RelatedPromptsUnmounted'] },
)

/**
 * Performs a track of a query with no results that used semantic queries as fallback.
 * The totalHits will be changed to -1 if semantic queries are found in order to differentiate
 * it from scenarios where the user encounters a no-results page without any semantic queries.
 *
 * @public
 * @deprecated - Use {@link trackNoResultsQueryWithFallbackWire} instead.
 */
export const trackNoResultsQueryWithSemanticsWire = trackNoResultsQueryWithFallbackWire

/**
 * Debounced version of {@link trackNoResultsQueryWithFallbackWire}
 *
 * @public
 * @deprecated - Use {@link trackNoResultsQueryWithFallbackWireDebounced} instead.
 */
export const trackNoResultsQueryWithSemanticsWireDebounced =
  trackNoResultsQueryWithFallbackWireDebounced

/**
 * Performs a track of clicking the AI overview expand button when the playload (expanded) is false.
 *
 * @public
 */
export const trackAiOverviewButtonClickedWire = filterTruthyPayload(
  wireDispatch('track', ({ metadata: { toolingDisplayClick, suggestionText } }) => {
    const taggingInfo = {
      ...(toolingDisplayClick as TaggingRequest),
      params: {
        ...(toolingDisplayClick as TaggingRequest).params,
        productId: 'EXPAND',
        title: suggestionText as string,
        url: 'none',
      },
    }

    return taggingInfo
  }),
)

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
      const taggingInfo: TaggingRequest = tagging[property]
      const location = metadata.location as FeatureLocation

      taggingInfo.params.location = location
      taggingInfo.params.displayFamily = createOrigin({
        feature: metadata.feature,
        location,
      })!
      taggingInfo.params.q = (metadata as DisplayWireMetadata).displayOriginalQuery

      return taggingInfo
    }),
    // eslint-disable-next-line ts/no-unsafe-member-access
    ({ eventPayload: { tagging } }) => !!tagging?.[property]?.url,
  )
}

/**
 * Update the tooling tagging params with the result information.
 *
 * @param taggingRequest - The tooling tagging request to be updated.
 * @param result - The clicked result.
 * @returns The tagging request updated.
 *
 * @internal
 */
function updateToolingTaggingWithResult(
  taggingRequest: TaggingRequest,
  result: Result,
): TaggingRequest {
  taggingRequest.params.productId = result.id
  taggingRequest.params.title = result.name!
  taggingRequest.params.url = result.url!

  return taggingRequest
}

/**
 * Factory helper to create a wire for the track of the tooling display click.
 *
 * @returns A new wire for the tooling display click of the taggable element.
 *
 * @public
 */
export function createTrackToolingDisplayWire(): Wire<Taggable> {
  return filter(
    wireDispatch('track', ({ eventPayload, metadata }) => {
      const taggingInfo: TaggingRequest = metadata.toolingTagging as TaggingRequest
      const resultInfo = eventPayload as Result

      updateToolingTaggingWithResult(taggingInfo, resultInfo)

      return taggingInfo
    }),
    ({ metadata }) => !!metadata?.toolingTagging,
  )
}

/**
 * Factory helper to create a wire for the track of the tooling display add to cart.
 *
 * @returns A new wire for the tooling display add to cart of the taggable element.
 *
 * @public
 */
export function createTrackToolingAdd2CartWire(): Wire<Taggable> {
  return filter(
    wireDispatch('track', ({ eventPayload, metadata }) => {
      const taggingInfo: TaggingRequest = metadata.toolingAdd2CartTagging as TaggingRequest
      const resultInfo = eventPayload as Result

      updateToolingTaggingWithResult(taggingInfo, resultInfo)

      return taggingInfo
    }),
    ({ metadata }) => !!metadata?.toolingAdd2CartTagging,
  )
}

/**
 * Factory helper to create a wire for the track of the tooling display click in a related prompt.
 *
 * @returns A new wire for the tooling display click of the taggable element.
 *
 * @public
 */
export function createTrackRelatedPromptToolingDisplayClickWire() {
  return filter(
    wireDispatch('track', ({ metadata }) => {
      const relatedPrompt = metadata.relatedPrompt as RelatedPrompt
      const taggingInfo = relatedPrompt.tagging!.toolingDisplayClickTagging as TaggingRequest

      taggingInfo.params.productId = 'EXPAND'
      taggingInfo.params.title = relatedPrompt.suggestionText
      taggingInfo.params.url = 'none'

      return taggingInfo
    }),
    ({ metadata }) => {
      const relatedPrompt = metadata.relatedPrompt as RelatedPrompt | undefined
      const isUnselected = metadata?.selectedPrompt === -1
      const taggingInfo = relatedPrompt?.tagging?.toolingDisplayClickTagging
      return isUnselected && !!taggingInfo
    },
  )
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
      ({ metadata: { queryTagging } }) => queryTagging as TaggingRequest,
    ),
    ({ metadata: { queryTagging } }) => !!queryTagging,
  )
}

/**
 * Wiring configuration for the {@link TaggingXModule | tagging module}.
 *
 * @internal
 */
export const taggingWiring = createWiring({
  ConsentProvided: {
    setConsent,
  },
  ConsentChanged: {
    clearSessionWire,
  },
  PDPIsLoaded: {
    moveClickedResultToSessionWire,
  },
  ResultURLTrackingEnabled: {
    moveClickedResultToSessionWire,
  },
  SearchTaggingChanged: {
    setQueryTaggingInfo,
  },
  SearchTaggingReceived: {
    trackQueryWire,
  },
  TrackableElementDisplayed: {
    trackElementDisplayedWire,
  },
  TaggingConfigProvided: {
    setTaggingConfig,
  },
  UserClickedAResult: {
    trackResultClickedWire,
    storeClickedResultWire,
  },
  UserClickedResultAddToCart: {
    trackAddToCartWire,
    trackResultClickedWire,
    storeAddToCartWire,
  },
  UserClickedPDPAddToCart: {
    trackAddToCartFromSessionStorage,
  },
  UserClickedABanner: {
    trackBannerClickedWire,
  },
  UserClickedAPromoted: {
    trackPromotedClickedWire,
  },
  UserClickedADisplayResult: {
    trackDisplayClickedWire,
    setQueryTaggingFromQueryPreview,
  },
  SemanticQueriesResponseChanged: {
    trackNoResultsQueryWithFallbackWireDebounced,
  },
  RelatedPromptsResponseChanged: {
    trackNoResultsQueryWithFallbackWireDebounced,
  },
  ModuleRegistered: {
    setNoResultsTaggingEnabledWire,
  },
  UserClickedARelatedPromptResult: {
    trackToolingDisplayClickedWire,
  },
  UserClickedARelatedPromptAdd2Cart: {
    trackToolingAdd2CartWire,
  },
  UserSelectedARelatedPrompt: {
    trackRelatedPromptToolingDisplayClickWire,
  },
  UserClickedAiOverviewButton: {
    trackAiOverviewButtonClickedWire,
  },
})
