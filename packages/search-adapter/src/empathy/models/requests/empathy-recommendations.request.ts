/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export interface EmpathyTopRecommendationsRequest {
  catalogue?: string;
  lang: string;
  origin?: string;
  rows?: number;
  scope: string;
  store?: string;
  warehouse?: string;
  q?: string;
}
