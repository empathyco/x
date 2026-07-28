import type { WirePayload, XEventPayload } from '../../wiring'
import {
  createWireFromFunction,
  createWiring,
  namespacedWireCommit,
  namespacedWireCommitWithoutPayload,
  namespacedWireDispatch,
} from '../../wiring'

/**
 * WireCommit for {@link VendorXModule}.
 *
 * @internal
 */
const wireCommit = namespacedWireCommit('vendor')

/**
 * WireCommitWithoutPayload for {@link VendorXModule}.
 *
 * @internal
 */
const wireCommitWithoutPayload = namespacedWireCommitWithoutPayload('vendor')

/**
 * WireDispatch for {@link VendorXModule}.
 *
 * @internal
 */
const wireDispatch = namespacedWireDispatch('vendor')

const fetchTagging = async (url: string) => fetch(url, { method: 'GET', keepalive: true })

const trackResultView = createWireFromFunction<XEventPayload<'UserViewedAVendorResult'>>(
  ({ eventPayload: { tagging } }) => tagging?.viewUrl && void fetchTagging(tagging.viewUrl),
)
const trackResultClick = createWireFromFunction<XEventPayload<'UserClickedAVendorResult'>>(
  ({ eventPayload: { tagging } }) => tagging?.clickUrl && void fetchTagging(tagging.clickUrl),
)
const trackResultAddToCart = createWireFromFunction<
  XEventPayload<'UserClickedVendorResultAddToCart'>
>(({ eventPayload: { tagging } }) => tagging?.add2cartUrl && void fetchTagging(tagging.add2cartUrl))
const trackBannerView = createWireFromFunction<XEventPayload<'UserViewedAVendorBanner'>>(
  ({ eventPayload: { tagging } }) => tagging?.viewUrl && void fetchTagging(tagging.viewUrl),
)
const trackBannerClick = createWireFromFunction<XEventPayload<'UserClickedAVendorBanner'>>(
  ({ eventPayload: { tagging } }) => tagging?.clickUrl && void fetchTagging(tagging.clickUrl),
)
/**
 * Sets the vendor results of the {@link VendorXModule}.
 *
 * @public
 */
export const setResults = wireCommit(
  'setResults',
  ({ eventPayload }: WirePayload<XEventPayload<'VendorResultsChanged'>>) =>
    eventPayload.map(vendorResult => ({
      ...vendorResult,
      modelName: 'VendorResult' as const,
    })),
)

/**
 * Sets the vendor banners of the {@link VendorXModule}.
 *
 * @public
 */
export const setBanners = wireCommit(
  'setBanners',
  ({ eventPayload }: WirePayload<XEventPayload<'VendorBannersChanged'>>) =>
    eventPayload.map(vendorBanner => ({
      ...vendorBanner,
      modelName: 'VendorBanner' as const,
    })),
)

/**
 * Sets the vendor query of the {@link VendorXModule}.
 *
 * @public
 */
const setVendorQuery = wireCommit('setQuery')

/**
 * Resets the vendor query of the {@link VendorXModule}.
 *
 * @public
 */
const resetVendorQuery = wireCommit('setQuery', '')

/**
 * Resets the vendor state of the {@link VendorXModule}.
 *
 * @public
 */
const resetVendorState = wireCommitWithoutPayload('resetState')

/**
 * Sets the vendor state from URL data.
 *
 * @public
 */
const setUrlParams = wireDispatch('setUrlParams')

/**
 * Sets the vendor related tags of the {@link VendorXModule}.
 *
 * @public
 */
const setVendorRelatedTags = wireCommit('setRelatedTags')

/**
 * Wiring configuration for the {@link VendorXModule | vendor module}.
 *
 * @internal
 */
export const vendorWiring = createWiring({
  ParamsLoadedFromUrl: {
    setUrlParams,
  },
  VendorResultsChanged: {
    setResults,
  },
  UserViewedAVendorResult: {
    trackResultView,
  },
  UserClickedAVendorResult: {
    trackResultClick,
  },
  UserClickedVendorResultAddToCart: {
    trackResultAddToCart,
  },
  VendorBannersChanged: {
    setBanners,
  },
  UserViewedAVendorBanner: {
    trackBannerView,
  },
  UserClickedAVendorBanner: {
    trackBannerClick,
  },
  SelectedRelatedTagsChanged: {
    resetVendorState,
    setVendorRelatedTags,
  },
  UserAcceptedAQuery: {
    resetVendorState,
    setVendorQuery,
  },
  UserClearedQuery: {
    resetVendorState,
    resetVendorQuery,
  },
  UserBrowsedToCategory: {
    resetVendorState,
    resetVendorQuery,
  },
})
