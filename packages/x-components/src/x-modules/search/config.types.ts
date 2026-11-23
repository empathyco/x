import type { PageMode } from '../../types/page-mode'

/**
 * Configuration options for the {@link SearchXModule}.
 *
 * @public
 */
export interface SearchConfig {
  /**
   * Maximum number of results to request.
   */
  pageSize: number
  pageMode: PageMode
  /**
   * Catalog section sent when no catalog section has been selected, either because none was
   * provided or because it was reset to an empty value.
   */
  defaultCatalogSection: string
  /**
   * The id of the price facet that is used to sort the results by price. If not provided, the
   * sort is sent as-is, i.e. still using `price`.
   */
  priceSortField?: string
  /**
   * Extra params to search again with when a search returns no results, e.g.
   * `{ section: 'section-a' }`. The keys are those of the request `extraParams`, before the
   * adapter maps them. All of them are sent together in a single new request. If it has results,
   * they are shown and the params are kept for the next searches: the one matching the
   * `catalogSectionParamKey` becomes the selected catalog section, and the rest are stored as
   * extra params.
   */
  noResultsFallback?: Record<string, string>
}
