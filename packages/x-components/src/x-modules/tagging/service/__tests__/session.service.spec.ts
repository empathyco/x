import { DefaultSessionService } from '../session.service';
import { StorageService } from '../types';

/**
 * Storage Service mock version.
 *
 * @internal
 */
class MockedStorageService implements StorageService {
  getSessionIdSpy = jest.fn();
  setSessionIdSpy = jest.fn();
  removeSessionIdSpy = jest.fn();

  constructor(protected storage: Storage, protected prefix: string) {
  }

  getPrefix(): string {
    return this.prefix;
  }

  injectGetResponse(key: string): void {
    this.getSessionIdSpy.mockReturnValue(key);
  }

  getItem<T = any>(key: string): any {
    return this.getSessionIdSpy(key);
  }

  setItem(key: string, item: any, ttlInMs?: number) {
    this.setSessionIdSpy(key, item, ttlInMs);
  }

  removeItem<T = any>(key: string): any {
    this.removeSessionIdSpy(key);
    return key;
  }

  clear(): number {
    return  0;
  }
}

const prefix = 'test';
const mockedStorageService = new MockedStorageService(localStorage, prefix);
const sessionService  = new DefaultSessionService(mockedStorageService, 1);

describe('testing session id service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('creates a new session id', () => {
    const session = sessionService.getSessionId();
    expect(mockedStorageService.getPrefix()).toBe(prefix);
    expect(mockedStorageService.getSessionIdSpy).toHaveBeenCalledTimes(1);
    expect(mockedStorageService.setSessionIdSpy).toHaveBeenCalledTimes(1);
    expect(mockedStorageService.removeSessionIdSpy).not.toHaveBeenCalled();
    expect(mockedStorageService.setSessionIdSpy).toHaveBeenCalledWith(
      'session-id',
      expect.any(String),
      expect.any(Number)
    );
    expect(session).toHaveLength(21);
    expect(session).toMatch(/[A-Za-z0-9_-]/);
  });

  it('returns an existing session id', () => {
    mockedStorageService.injectGetResponse('session-id');
    const session = sessionService.getSessionId();
    expect(mockedStorageService.getPrefix()).toBe(prefix);
    expect(mockedStorageService.getSessionIdSpy).toHaveBeenCalledTimes(1);
    expect(mockedStorageService.setSessionIdSpy).toHaveBeenCalledTimes(1);
    expect(mockedStorageService.removeSessionIdSpy).not.toHaveBeenCalled();
    expect(mockedStorageService.setSessionIdSpy).toHaveBeenCalledWith(
      'session-id',
      'session-id',
      expect.any(Number)
    );
    expect(session).toBe('session-id');
  });

  it('removes an existing session id', () => {
    sessionService.clearSessionId();
    expect(mockedStorageService.getPrefix()).toBe(prefix);
    expect(mockedStorageService.getSessionIdSpy).not.toHaveBeenCalled();
    expect(mockedStorageService.setSessionIdSpy).not.toHaveBeenCalled();
    expect(mockedStorageService.removeSessionIdSpy).toHaveBeenCalledTimes(1);
  });
});
