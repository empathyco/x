import { Result } from './result/result.model';

export interface PartialResult {
  results: Result[];
  numFound: number;
  term: string;
}
