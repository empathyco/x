import type { VendorResultPayload } from './store/types'
import { createWiring, namespacedWireCommit } from '../../wiring'

/**
 * WireCommit for {@link VendorXModule}.
 *
 * @internal
 */
const wireCommit = namespacedWireCommit('vendor')

/**
 * Sets the vendor results of the {@link VendorXModule}.
 *
 * @public
 */
export const setVendorResults = wireCommit(
  'setVendorResults',
  ({ eventPayload }: { eventPayload: VendorResultPayload[] }) =>
    eventPayload.map(({ item, position }) => ({
      ...item,
      modelName: 'VendorResult' as const,
      position,
    })),
)

/**
 * Wiring configuration for the {@link VendorXModule | vendor module}.
 *
 * @internal
 */
export const vendorWiring = createWiring({
  UserVendorResultsChanged: {
    setVendorResults,
  },
})
