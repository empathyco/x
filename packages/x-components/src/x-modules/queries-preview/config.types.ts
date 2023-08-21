/**
 * Configuration options for the {@link QueriesPreviewXModule}.
 *
 * @public
 */
export interface QueriesPreviewConfig {
  /**
   * Debounce time measured in milliseconds used to delete the query preview module selected query
   * to wait & ensure user is not refining the search by typing or selecting a suggestion.
   */
  debounceInMs: number;
  /**
   * Maximum number of items to request.
   */
  maxItemsToRequest: number;
}
