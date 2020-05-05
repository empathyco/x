/**
 * Interface with the API functions exposes as X
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/Window | window} property.
 *
 * @public
 */
export interface XAPI {
  /**
   * Throw a search with the query parameter.
   *
   * @param query - Query to be searched.
   */
  search(query: string): void;
}
