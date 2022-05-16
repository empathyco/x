/**
 * Configuration options for the {@link TaggingXModule}.
 *
 * @public
 */
export interface TaggingConfig {
  /**
   * Time in milliseconds to track the query.
   */
  queryTaggingDebounceMs: number;
  /**
   * Time in milliseconds to keep the session alive. After this time has passed with no user
   * interaction, the session will be cleared.
   */
  sessionTTLMs: number;

  /**
   * Time in milliseconds to keep the information for a result clicked by the user.
   */
  clickedResultStorageTTLMs: number | null;

  /**
   * Field of the {@link @empathyco/x-types#Result | result} to use as id for storing the
   * information.
   */
  clickedResultStorageKey: string | null;
}
