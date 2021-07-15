/**
 * Configuration options for the popular searches module.
 *
 * @public
 */
export interface PopularSearchesConfig {
  /**
   * Number of popular searches to request.
   */
  maxItemsToRequest: number;
  /**
   * Hides the popular searches that have been already searched during the session.
   *
   * @example
   * When set to true:
   * ```
   * query = 'shorts';
   * query = 'trousers';
   * suggestions = ['t-shirt', 'shorts', 'dress']
   * // Suggests ['t-shirt', 'dress']
   * ```
   *
   * @example
   * When set to false:
   * ```
   * query = 'shorts';
   * query = 'trousers';
   * suggestions = ['t-shirt', 'shorts', 'dress']
   * // Suggests ['t-shirt', 'shorts', 'dress']
   * ```
   */
  hideSessionQueries: boolean;
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
