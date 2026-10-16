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
}
