import { nanoid } from 'nanoid';
  import { StorageService as EmpathyStorageService } from '@empathyco/x-storage-service';
import { SessionService, StorageService } from './types';

/**
 * Default implementation for the {@link SessionService}.
 *
 * @public
 */
export class DefaultSessionService implements SessionService {
  protected readonly SESSION_ID_KEY = 'session-id';

  /**
   * Global instance of the {@link SessionService}.
   */
  public static instance: SessionService = new DefaultSessionService();

  public constructor(
    protected storageService: StorageService = new EmpathyStorageService(localStorage, 'x'),
    protected ttlInMs = 1800 // 30m * 60s * 1000 = 1800_000ms
  ) {}

  /**
   * Gets the session id from the storage:
   * - If exists it updates the session's TTL.
   * - If doesn't exist it creates and stores a new one using the TTL.
   *
   * @returns The session id.
   *
   * @public
   */
  getSessionId(): string {
    const sessionId = this.storageService.getItem(this.SESSION_ID_KEY) ?? this.createSessionId();
    this.storageService.setItem(this.SESSION_ID_KEY, sessionId, Date.now() + this.ttlInMs);
    return sessionId;
  }

  /**
   * Removes the session id in the storage.
   *
   * @public
   */
  clearSessionId(): void {
    this.storageService.removeItem(this.SESSION_ID_KEY);
  }

  /**
   * Generates an unique session id.
   *
   * @returns The new session id.
   *
   * @internal
   */
  private createSessionId = (): string => nanoid();
}
