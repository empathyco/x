/**
 * Service to manipulate the session id.
 *
 * @public
 */
export interface SessionService {
  /**
   * Get the current session id from the storage:
   * - If it's present then:
   * - If it's valid just return it.
   * - If it's outdated it will generate a new one.
   * - If not creates a new one.
   *
   * @returns The session id.
   */
  getSessionId(): string;
  /**
   * Remove the session id.
   */
  clearSessionId(): void;
}

export interface StorageService {
  setItem(key: string, item: any, ttlInMs?: number): void;
  getItem<T = any>(key: string): T | null;
  removeItem<T = any>(key: string): T | null;
  clear(): number;
}
