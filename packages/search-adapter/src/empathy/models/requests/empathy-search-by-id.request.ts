/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export interface EmpathySearchByIdRequest {
  catalogue?: string;
  lang: string;
  q: string;
  rows?: number;
  store?: string;
  warehouse?: string;
}
