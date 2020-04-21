/**
 * Configuration options for the {@link NextQueriesXModule}.
 *
 * @public
 */
export interface NextQueriesConfig {
  /**
   * Maximum number of next queries to request.
   */
  maxItemsToRender: number;
  /**
   * Hides the next queries if it has been already searched during the session.
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
   * Loads the next queries with the last searched query.
   */
  loadOnInit: boolean;
}
