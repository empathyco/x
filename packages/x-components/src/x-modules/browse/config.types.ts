import type { PageMode } from '../../types/page-mode'

/**
 * Configuration options for the {@link BrowseXModule}.
 *
 * @public
 */
export interface BrowseConfig {
  /**
   * Maximum number of results to request.
   */
  pageSize: number
  pageMode: PageMode
}
