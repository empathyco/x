/**
 * Configuration options for the {@link QueriesPreviewXModule}.
 *
 * @public
 */
export interface QueriesPreviewConfig {
  /**
   * Debounce time measured in milliseconds used to store the query preview module selected query
   * while the user is typing a query.
   */
  debounceInMs: number;
  /**
   * Maximum number of items to request.
   */
  maxItemsToRequest: number;
}
