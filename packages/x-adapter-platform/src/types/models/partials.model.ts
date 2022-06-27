import { PlatformResult } from './result.model';

export interface PlatformPartialResult {
  term: string;
  numFound: number;
  content: PlatformResult[];
}
