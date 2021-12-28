/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export interface EmpathyNextQuery {
  source?: 'CURATED' | 'ORGANIC' | 'ENRICHED';
  query: string;
}
