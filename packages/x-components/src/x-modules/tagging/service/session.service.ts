import { nanoid } from 'nanoid';
import { BrowserStorageService, StorageService } from '@empathyco/x-storage-service';
import { SessionService } from './types';

/**
 * Default implementation for the {@link SessionService}.
 *
 * @public
 */
export class DefaultSessionService implements SessionService {
  public readonly SESSION_ID_KEY = 'session-id';

  /**
   * Global instance of the {@link SessionService}.
   */
  public static instance: SessionService = new DefaultSessionService();

  public constructor(
    protected storageService: StorageService = new BrowserStorageService(localStorage, 'x'),
    protected ttlMs = 1800000 // 30m * 60s * 1000 = 1800_000ms
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
