/**
 * Configuration options for the {@link QuerySuggestionsXModule}.
 *
 * @public
 */
export interface QuerySuggestionsConfig {
  /**
   * Debounce time measured in milliseconds used to store the query suggestions module query while
   * the user is typing a query.
   */
  debounceInMs: number;
  /**
   * Maximum number of query suggestions to request.
   */
  maxItemsToRequest: number;
  /**
   * Hides the suggestion if it is equal to the current query.
   *
   * @example
   * When set to true:
   * ```
   * query = 'trousers';
   * suggestions = ['trousers', 'trousers skinny', 'trousers straight']
   * // Suggests ['trousers skinny', 'trousers straight']
   * ```
   *
   * @example
   * When set to false:
   * ```
   * query = 'trousers';
   * suggestions = ['trousers', 'trousers skinny', 'trousers straight']
   * // Suggests ['trousers', 'trousers skinny', 'trousers straight']
   * ```
   */
  hideIfEqualsQuery: boolean;
}
