import { SortDirection } from '@empathy/search-types';

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export interface EmpathySearchRequest {
  catalogue?: string;
  filter: string[];
  lang: string;
  origin?: string;
  q: string;
  rows?: number;
  scope?: string;
  sort?: string;
  sortDirection?: SortDirection;
  start?: number;
  store?: string;
  warehouse?: string;
}
