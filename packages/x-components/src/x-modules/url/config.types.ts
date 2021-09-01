/**
 * Configuration options for the {@link UrlXModule}.
 *
 * @public
 */
export interface UrlConfig {
  query?: string;
  page?: string;
  filters?: string;
  sort?: string;
  relatedTags?: string;
  [extraParam: string]: string | undefined;
}
