/**
 * Service to manage the session id.
 *
 * @public
 */
export interface SessionService {
  /**
   * Gets the current session id from the storage.
   *
   * @remarks If a session id is outdated or does not exist,
   * a new one is created.
   *
   * @returns The session id.
   */
  getSessionId(): string;
  /**
   * Remove the session id.
   */
  clearSessionId(): void;
}
