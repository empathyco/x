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
   * Extra params to retry the search with, once, when it returns no results. The keys are the ones
   * of the `extraParams` of the search request (before the adapter), e.g.
   * `{ section: 'section-a' }`. If the retry returns results, they are shown and the params are
   * kept: the one named as the `catalogSectionParamKey` becomes the selected catalog section and
   * the rest are saved as extra params. It is not retried if the request already had all the
   * values.
   */
  noResultsFallback?: Record<string, string>
}
