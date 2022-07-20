import { Result } from '../result/result.model';

/**
 * Interface to type the next query preview objects.
 */
export interface NextQueryPreviewResults {
  /** The results to preview the next query search request. */
  items: Result[];
  /** The number of results of the next query. */
  totalResults: number;
}
