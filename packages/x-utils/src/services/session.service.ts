import type { StorageService } from '@empathyco/x-storage-service'
import type { SessionService } from './service.types'
import { BrowserStorageService, InMemoryStorageService } from '@empathyco/x-storage-service'

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
  public static readonly SESSION_ID_KEY = 'session-id'

  /**
   * Global instance of the {@link SessionService}.
   */
  public static instance: SessionService = new DefaultSessionService()

  public constructor(
    protected storageService: StorageService = typeof localStorage !== 'undefined'
      ? new BrowserStorageService(localStorage, 'x')
      : new InMemoryStorageService(),
    protected ttlMs = 1800000, // 30m * 60s * 1000 = 1800_000ms
  ) {}

  /**
   * Returns the session id of the storage.
   *
   * @returns The current session id.
   *
   * @public
   */
  getSessionId(): string {
    // eslint-disable-next-line ts/no-unsafe-assignment
    const sessionId =
      // eslint-disable-next-line no-restricted-globals
      this.storageService.getItem(DefaultSessionService.SESSION_ID_KEY) ?? self.crypto.randomUUID()
    this.storageService.setItem(DefaultSessionService.SESSION_ID_KEY, sessionId, this.ttlMs)
    // eslint-disable-next-line ts/no-unsafe-return
    return sessionId
  }

  /**
   * Removes the session if from the storage.
   *
   * @public
   */
  clearSessionId(): void {
    this.storageService.removeItem(DefaultSessionService.SESSION_ID_KEY)
  }
}
