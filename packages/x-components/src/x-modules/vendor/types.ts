import type { NamedModel, Result } from '@empathyco/x-types'

/**
 * The interface for a vendor result, extending the base Result interface.
 */
export interface VendorResult extends Omit<Result, 'modelName'>, NamedModel<'VendorResult'> {
  position: number
}
