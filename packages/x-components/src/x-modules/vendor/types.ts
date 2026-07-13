import type { Result } from '@empathyco/x-types'

/**
 * The interface for a vendor result, extending the base Result interface.
 */
export interface VendorResult extends Result {
  position: number
}
