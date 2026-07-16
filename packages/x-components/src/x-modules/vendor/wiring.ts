import type { WirePayload, XEventPayload } from '../../wiring'
import { createWireFromFunction, createWiring, namespacedWireCommit } from '../../wiring'

/**
 * WireCommit for {@link VendorXModule}.
 *
 * @internal
 */
const wireCommit = namespacedWireCommit('vendor')

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
 * Resets the vendor results of the {@link VendorXModule}.
 *
 * @public
 */
const resetResults = wireCommit('setResults', [])

/**
 * Resets the vendor banners of the {@link VendorXModule}.
 *
 * @public
 */
const resetBanners = wireCommit('setBanners', [])

/**
 * Wiring configuration for the {@link VendorXModule | vendor module}.
 *
 * @internal
 */
export const vendorWiring = createWiring({
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
  SearchRequestChanged: {
    resetResults,
    resetBanners,
  },
})
