import { Result } from './result/result.model';

/**
 * Interface to type the query preview objects.
 */
export interface PreviewResults {
  /** The searched query. */
  query: string;
  /** The results to preview the search request. */
  items: Result[];
  /** The number of results of the query. */
  totalResults: number;
}
