import type { NamedModel } from '../named-model.model'
import type { Previewable } from '../previewable.model'

/**
 * A next query is a suggestion of a new query that the user may be interested after searching
 * for an specific term.
 *
 * @public
 */
export interface NextQuery extends NamedModel<'NextQuery'>, Required<Previewable> {
  /** If it's a curated next query. */
  isCurated?: boolean
}
