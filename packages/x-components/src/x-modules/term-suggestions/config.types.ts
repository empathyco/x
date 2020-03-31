/**
 * Configuration options for the {@link TermSuggestionsXModule}.
 *
 * @public
 */
export interface TermSuggestionsConfig {
  /**
   * Debounce time measured in milliseconds used to store the term suggestions module query while
   * the user is typing a query.
   */
  debounceInMs: number;
  /**
   * Maximum number of term suggestions to request.
   */
  maxItems: number;
  /**
   * Show the extra suggestion that has filters without the filter.
   *
   * @remarks
   * Remember this property might be affected by {@link TermSuggestionsConfig.hideIfEqualsQuery}
   *
   * @example
   * When set to true:
   * ```
   * query = 'trou';
   * suggestions = ['trousers', 'trousers in man', 'trousers in woman'];
   * // Suggests ['trousers', 'trousers in man', 'trousers in woman']
   * ```
   *
   * @example
   * When set to false:
   * ```
   * query = 'trou';
   * suggestions = ['trousers', 'trousers in man', 'trousers in woman'];
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
