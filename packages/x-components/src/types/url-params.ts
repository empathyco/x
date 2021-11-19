/**
 * URL store params.
 *
 * @public
 */
export interface UrlParams {
  query: string;
  page: number;
  filter: string[];
  sort: string;
  tag: string[];
  scroll: string;
  [extraParamKey: string]: unknown;
}
