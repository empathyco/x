import { EmpathyResult } from './empathy-result.model';

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export interface EmpathyPartialResult {
  docs: EmpathyResult[];
  numFound: number;
  suggestion: string;
}
