/**
 * Configuration options for the {@link SemanticQueriesXModule}.
 *
 * @public
 */
export interface SemanticQueriesConfig {
  /**
   * Number of SemanticQueries to request.
   */
  maxItemsToRequest: number;
  /**
   * Maximum number of results in the SearchResponse to display semantic queries.
   */
  threshold: number;
}
