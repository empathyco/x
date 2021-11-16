/**
 * Configuration options for the {@link TaggingXModule}.
 *
 * @public
 */
export interface TaggingConfig {
  /**
   * Time in milliseconds to keep the session alive. After this time has passed with no user
   * interaction, the session will be cleared.
   */
  sessionTTLInMs: number;
  /**
   * Time in milliseconds to track the query.
   */
  queryTaggingDebounceMs: number;
}
