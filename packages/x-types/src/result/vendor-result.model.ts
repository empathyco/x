import type { NamedModel } from '../named-model.model'
import type { Result } from './result.model'

/**
 * Input structure for providing vendor results with positioning information.
 * This separates the result item from its metadata for better scalability.
 * The modelName is optional and will be set automatically to 'VendorResult'.
 *
 * @public
 */
export interface VendorResultPayload {
  /** The result item to be inserted (modelName will be set automatically). */
  item: Omit<Result, 'modelName'>
  /** The position where this vendor result should be placed in the results grid. */
  position: number
}

/**
 * A vendor result is a Result that has been assigned a specific position in the results grid.
 * It extends the base Result interface with a position property to control placement.
 *
 * @public
 */
export interface VendorResult extends Omit<Result, 'modelName'>, NamedModel<'VendorResult'> {
  /** The position where this vendor result should be placed in the results grid. */
  position: number
}
