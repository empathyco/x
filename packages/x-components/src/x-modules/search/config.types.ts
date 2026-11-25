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
   * Values to search again with when a search returns no results, in a single new request:
   * `{ catalogSection: 'section-a', extraParams: { market: 'market-b' } }`.
   * It is applied at most once per search, and not if the selected catalog section or the search
   * extra params already have those values.
   *
   * The `catalogSection` becomes the selected catalog section. It is kept in the next searches
   * until the user selects another section or the search is reset (the query is cleared, the
   * layer is closed or the user browses to a category), and it changes even if the new search has
   * no results either.
   *
   * The `extraParams` are stored as extra params, with the keys of the request `extraParams`
   * before the adapter maps them. They require the extra params module to be registered: without
   * it, a fallback with `extraParams` does not search again and the status stays as `loading`
   * until the next search.
   *
   * The catalog section goes apart, in `catalogSection`, and not inside `extraParams`. The
   * selected section is part of the search state, which is what the catalog section tabs read,
   * and the search request sends it under the `catalogSectionParamKey`, taking precedence over
   * the extra params. Inside `extraParams` the tabs would not change, and the value would not be
   * sent if a section was already selected.
   */
  noResultsFallback?: {
    catalogSection?: string
    extraParams?: Record<string, string>
  }
}
