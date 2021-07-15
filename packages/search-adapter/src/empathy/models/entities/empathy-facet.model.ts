/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export interface EmpathyFacet {
  facet: string;
  values: EmpathyFilter[];
}

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export interface EmpathyFilter {
  count: number;
  filter: string;
  selected?: boolean;
  value: string;
  values?: EmpathyFilter[];
}
