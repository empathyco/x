import { nanoid } from 'nanoid';
import { BrowserStorageService, StorageService } from '@empathyco/x-storage-service';
import { SessionService } from './types';

/**
 * Default implementation for the {@link SessionService}.
 *
 * @public
 */
export class DefaultSessionService implements SessionService {
  /**
   * Session id key to use as key in the storage.
   *
   * @public
   */
  public static readonly SESSION_ID_KEY = 'session-id';

  /**
   * Global instance of the {@link SessionService}.
   */
  public static instance: SessionService = new DefaultSessionService();

  public constructor(
    protected storageService: StorageService = new BrowserStorageService(localStorage, 'x'),
    protected ttlMs = 1800000 // 30m * 60s * 1000 = 1800_000ms
  ) {}

  /**
   * Returns the session id of the storage.
   *
   * @returns The current session id.
   *
   * @public
   */
  getSessionId(): string {
    const sessionId = this.storageService.getItem(DefaultSessionService.SESSION_ID_KEY) ?? nanoid();
    this.storageService.setItem(
      DefaultSessionService.SESSION_ID_KEY,
      sessionId,
      Date.now() + this.ttlMs
    );
    return sessionId;
  }

  /**
   * Removes the session if from the storage.
   *
   * @public
   */
  clearSessionId(): void {
    this.storageService.removeItem(DefaultSessionService.SESSION_ID_KEY);
  }
}
