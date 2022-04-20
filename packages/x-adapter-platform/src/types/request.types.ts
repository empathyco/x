export interface PlatformSearchRequest extends ExtraParamsRequest {
  catalogue?: string;
  filter: string[];
  lang: string;
  origin?: string;
  query: string;
  rows?: number;
  scope?: string;
  sort?: string;
  sortDirection?: string;
  start?: number;
  store?: string;
  warehouse?: string;
}

/**
 * Interface to support extra params.
 *
 * @public
 */
export interface ExtraParamsRequest {
  [key: string]: unknown;
}
