/**
 * Configuration options for the popular searches module.
 *
 * @public
 */
export interface PopularSearchesConfig {
  /**
   * Maximum number of popular searches to show.
   */
  maxItemsToRender: number;
  /**
   * Show the extra suggestion that has filters without the filter.
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
}
