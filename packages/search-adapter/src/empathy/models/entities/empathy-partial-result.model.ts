import { EmpathyResult } from './empathy-result.model';

export interface EmpathyPartialResult {
  docs: EmpathyResult[];
  numFound: number;
  suggestion: string;
}
