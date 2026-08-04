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

const trackMounted = createWireFromFunction<
  XEventPayload<'VendorResultMounted' | 'VendorBannerMounted'>
>(({ eventPayload: { tagging } }) => tagging?.mountedUrl && void fetchTagging(tagging.mountedUrl))

const trackView = createWireFromFunction<
  XEventPayload<'UserViewedAVendorResult' | 'UserViewedAVendorBanner'>
>(({ eventPayload: { tagging } }) => tagging?.viewUrl && void fetchTagging(tagging.viewUrl))

const trackClick = createWireFromFunction<
  XEventPayload<'UserClickedAVendorResult' | 'UserClickedAVendorBanner'>
>(({ eventPayload: { tagging } }) => tagging?.clickUrl && void fetchTagging(tagging.clickUrl))

const trackResultAddToCart = createWireFromFunction<
  XEventPayload<'UserClickedVendorResultAddToCart'>
>(({ eventPayload: { tagging } }) => tagging?.add2cartUrl && void fetchTagging(tagging.add2cartUrl))

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
 * Sets the vendor results of a query preview in the {@link VendorXModule}.
 *
 * @public
 */
export const setQueryPreviewVendorResults = wireCommit('setQueryPreviewVendorResults')

/**
 * Sets the vendor banners of a query preview in the {@link VendorXModule}.
 *
 * @public
 */
export const setQueryPreviewVendorBanners = wireCommit('setQueryPreviewVendorBanners')

/**
 * Removes the vendor data of a non-cacheable query preview when it is unmounted.
 *
 * @internal
 */
const removeQueryPreviewVendorData = createWireFromFunction<XEventPayload<'QueryPreviewUnmounted'>>(
  ({ eventPayload, store }) => {
    if (!eventPayload.cache) {
      store.commit('x/vendor/removeQueryPreviewVendorData', eventPayload.queryPreviewHash)
    }
  },
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
  VendorResultMounted: {
    trackMounted,
  },
  UserViewedAVendorResult: {
    trackView,
  },
  UserClickedAVendorResult: {
    trackClick,
  },
  UserClickedVendorResultAddToCart: {
    trackResultAddToCart,
  },
  VendorBannersChanged: {
    setBanners,
  },
  QueryPreviewVendorResultsChanged: {
    setQueryPreviewVendorResults,
  },
  QueryPreviewVendorBannersChanged: {
    setQueryPreviewVendorBanners,
  },
  QueryPreviewUnmounted: {
    removeQueryPreviewVendorData,
  },
  VendorBannerMounted: {
    trackMounted,
  },
  UserViewedAVendorBanner: {
    trackView,
  },
  UserClickedAVendorBanner: {
    trackClick,
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
