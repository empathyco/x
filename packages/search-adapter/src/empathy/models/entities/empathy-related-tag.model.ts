/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export interface EmpathyRelatedTag {
  source?: 'CURATED' | 'ORGANIC' | 'ENRICHED';
  position?: number;
  query: string;
  tag: string;
}
