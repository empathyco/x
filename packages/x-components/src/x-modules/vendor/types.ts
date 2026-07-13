import type { Result } from '@empathyco/x-types'

/**
 * The interface for a vendor result, extending the base Result interface.
 * A vendor field is grouping since we want to avoid naming collisions with Customer Result mappings
 */
export interface VendorResult extends Result {
  vendor: {
    position: number
  }
}
