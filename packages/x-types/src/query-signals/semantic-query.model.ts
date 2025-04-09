import type { NamedModel } from '../named-model.model'

/**
 * A semantic query is a term related to another in a semantic way.
 */
export interface SemanticQuery extends NamedModel<'SemanticQuery'> {
  /* A query related to another previously searched. */
  query: string
  /* The semantic distance from the searched query. */
  distance: number
}
