/**
 * Configuration options for the {@link IdentifierResultsXModule}.
 *
 * @public
 */
export interface IdentifierResultsConfig {
  /**
   * Debounce time measured in milliseconds used to store the identifier results module query while
   * the user is typing a query.
   */
  debounceInMs: number;
  /**
   * Maximum number of identifier results to request.
   */
  maxItemsToRequest: number;
  /**
   * The regex to match the query.
   */
  identifierDetectionRegexp: string;
  /**
   * The string with all the optional separator characters that may be placed between chars in an
   * identifier result.
   */
  separatorChars: string;
}
