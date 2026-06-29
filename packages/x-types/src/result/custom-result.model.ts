import type { NamedModel } from '../named-model.model'
import type { Result } from './result.model'

/**
 * Input structure for providing custom results with positioning information.
 * This separates the result item from its metadata for better scalability.
 * The modelName is optional and will be set automatically to 'CustomResult'.
 *
 * @public
 */
export interface CustomResultPayload {
  /** The result item to be inserted (modelName will be set automatically). */
  item: Omit<Result, 'modelName'>
  /** The position where this custom result should be placed in the results grid. */
  position: number
}

/**
 * A custom result is a Result that has been assigned a specific position in the results grid.
 * It extends the base Result interface with a position property to control placement.
 *
 * @public
 */
export interface CustomResult extends Omit<Result, 'modelName'>, NamedModel<'CustomResult'> {
  /** The position where this custom result should be placed in the results grid. */
  position: number
}
