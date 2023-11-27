/**
 * Configuration options for the {@link QueriesPreviewXModule}.
 *
 * @public
 */
export interface QueriesPreviewConfig {
  /**
   * Maximum number of items to request.
   */
  maxItemsToRequest: number;
  /**
   * Maximum number of most recent used queries preview.
   */
  maxQueryPreviewHistoryLength: number;
}
