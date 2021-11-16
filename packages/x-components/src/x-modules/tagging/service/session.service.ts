import { nanoid } from 'nanoid';
import { StorageService } from '@empathyco/x-storage-service';
import { SessionService } from './types';

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
    protected storageService: StorageService = new StorageService(localStorage, 'x'),
    protected ttlMs = 1800 // 30m * 60s * 1000 = 1800_000ms
  ) {}

  getSessionId(): string {
    const sessionId = this.storageService.getItem(this.SESSION_ID_KEY) ?? nanoid();
    this.storageService.setItem(this.SESSION_ID_KEY, sessionId, Date.now() + this.ttlMs);
    return sessionId;
  }

  clearSessionId(): void {
    this.storageService.removeItem(this.SESSION_ID_KEY);
  }
}
