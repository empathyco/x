import type { StorageService } from './storage/types'
import type { SessionService } from './types'
import { BrowserStorageService } from './storage/browser'
import { InMemoryStorageService } from './storage/in-memory'

/**
 * Default implementation for the {@link SessionService}.
 */
export class DefaultSessionService implements SessionService {
  /** Session id key to use as a key in the storage. */
  public static readonly SESSION_ID_KEY = 'session-id'

  /** Global instance of the {@link SessionService}. */
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
   */
  getSessionId(): string {
    const sessionId =
      // eslint-disable-next-line no-restricted-globals
      this.storageService.getItem(DefaultSessionService.SESSION_ID_KEY) ?? self.crypto.randomUUID()
    this.storageService.setItem(DefaultSessionService.SESSION_ID_KEY, sessionId, this.ttlMs)
    return sessionId
  }

  /**
   * Removes the session if from the storage.
   */
  clearSessionId() {
    this.storageService.removeItem(DefaultSessionService.SESSION_ID_KEY)
  }
}
