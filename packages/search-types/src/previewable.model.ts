import { Facet } from './facet/facet.model';
import { Result } from './result/result.model';

/**
 * Represents an item that is searchable, and the results associated to it.
 *
 * @public
 */
export interface Previewable {
  /** The query to search for. */
  query: string;
  /** Facets to apply to the `query` property when searching. */
  facets?: Facet[];
  /** The results that the combination of `query` and `facets` properties return, or `null` if
   * they have not been loaded yet. */
  results?: Result[] | null;
  /** The number of results that the combination of `query` and `facets` properties return, or
   * `null` if they have not been loaded yet. */
  totalResults?: number | null;
}
