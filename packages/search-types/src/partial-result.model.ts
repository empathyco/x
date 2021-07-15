import { Previewable } from './previewable.model';
import { Result } from './result/result.model';

/**
 * A partial result represents a sub-query of a user search term which normally has not enough
 * results (or not results at all).
 * It includes a preview of these results and the number of total results that match against the
 * sub-query.
 *
 * @public
 */
export interface PartialResult extends Previewable {
  /** {@inheritDoc Previewable.results} */
  results: Result[] | null;
  /** {@inheritDoc Previewable.totalResults} */
  totalResults: number | null;
}
