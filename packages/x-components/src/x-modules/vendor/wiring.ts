import type { WirePayload, XEventPayload } from '../../wiring'
import type { VendorResult, VendorResultTagging } from './types'
import { createWiring, namespacedWireCommit, namespacedWireDispatch } from '../../wiring'

type TrackVendorResultEvent =
  | 'UserViewedAVendorResult'
  | 'UserClickedAVendorResult'
  | 'UserClickedVendorResultAddToCart'

/**
 * WireCommit for {@link VendorXModule}.
 *
 * @internal
 */
const wireCommit = namespacedWireCommit('vendor')

/**
 * WireDispatch for {@link VendorXModule}.
 *
 * @internal
 */
const wireDispatch = namespacedWireDispatch('vendor')

/**
 * Tracks a vendor result for a specific tagging property.
 *
 * @param property - The tagging property to track (view, click, or add2cart).
 * @public
 */
const createTrackVendorResultWire = <Event extends TrackVendorResultEvent>(
  property: keyof VendorResultTagging,
) =>
  wireDispatch('trackResult', ({ eventPayload }: WirePayload<XEventPayload<Event>>) => ({
    result: eventPayload as VendorResult,
    trackingProperty: property,
  }))

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
 * Tracks the view event for a vendor result.
 *
 * @public
 */
const trackResultView = createTrackVendorResultWire<'UserViewedAVendorResult'>('view')

/**
 * Tracks the click event for a vendor result.
 *
 * @public
 */
const trackResultClick = createTrackVendorResultWire<'UserClickedAVendorResult'>('click')

/**
 * Tracks the add to cart event for a vendor result.
 *
 * @public
 */
const trackResultAddToCart =
  createTrackVendorResultWire<'UserClickedVendorResultAddToCart'>('add2cart')

/**
 * Resets the vendor results of the {@link VendorXModule}.
 *
 * @public
 */
const resetResults = wireCommit('setResults', [])

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
  SearchRequestChanged: {
    resetResults,
  },
})
