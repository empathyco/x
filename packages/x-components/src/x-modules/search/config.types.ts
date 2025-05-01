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
}
