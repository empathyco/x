import { Result } from './result/result.model';

/**
 * @public
 * A partial result represents a sub-query of a user search term which normally has not enough results (or not results at all)
 * It includes a preview of these results and the number of total results that match against the sub-query
 */
export interface PartialResult {
  results: Result[];
  numFound: number;
  term: string;
}
