import { Facet } from './facet/facet.model';
import { NamedModel } from './named-model.model';
import { Previewable } from './previewable.model';

/**
 * A suggestion represents a query that has been proposed to the user, due of being popular,
 * matching with the current search query...
 *
 * @public
 */
export interface Suggestion extends NamedModel<'QuerySuggestion' | 'PopularSearch'>, Previewable {
  // eslint-disable-next-line jsdoc/require-description-complete-sentence
  /** {@inheritDoc Previewable.facets} */
  facets: Facet[];
  /** If it's a curated suggestion. */
  isCurated?: boolean;
  /**
   * Unique identifier of the suggestion.
   *
   * @deprecated - The key field should be calculated if needed using the `query` and the
   * `facets` properties.
   */
  key: string;
}
