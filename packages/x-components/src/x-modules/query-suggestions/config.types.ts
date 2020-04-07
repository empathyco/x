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
  maxItems: number;
  /**
   * Show the extra suggestion that has filters without the filter.
   *
   * @remarks
   * Remember this property might be affected by {@link QuerySuggestionsConfig.hideIfEqualsQuery}
   *
   * @example
   * When set to true:
   * ```
   * query = 'trou';
   * suggestions = ['trousers in man', 'trousers in woman'];
   * // Suggests ['trousers', 'trousers in man', 'trousers in woman']
   * ```
   *
   * @example
   * When set to false:
   * ```
   * query = 'trou';
   * suggestions = ['trousers in man', 'trousers in woman'];
   * // Suggests ['trousers in man', 'trousers in woman']
   * ```
   */
  showExtraSuggestionWithoutFilter: boolean;
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
