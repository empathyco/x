import { InMemoryStorageService } from '@empathyco/x-storage-service';
import { DefaultSessionService } from '../session.service';

describe('testing session id service', () => {
  const mockedStorageService = new InMemoryStorageService();
  const sessionService = new DefaultSessionService(mockedStorageService, 1);
  const storageKey = DefaultSessionService.SESSION_ID_KEY;

  const getItemSpy = jest.spyOn(mockedStorageService, 'getItem');
  const setItemSpy = jest.spyOn(mockedStorageService, 'setItem');
  const removeItemSpy = jest.spyOn(mockedStorageService, 'removeItem');

  beforeEach(() => {
    jest.clearAllMocks();
    mockedStorageService.clear();
  });

  it('creates a new session id when calling getSessionId and a session does not exist', () => {
    const session = sessionService.getSessionId();
    expect(getItemSpy).toHaveBeenCalledTimes(1);
    expect(setItemSpy).toHaveBeenCalledTimes(1);
    expect(setItemSpy).toHaveBeenCalledWith(storageKey, expect.any(String), expect.any(Number));
    expect(session).toMatch(/[A-Za-z0-9_-]/);
  });

  it('removes an existing session id', () => {
    sessionService.clearSessionId();
    expect(removeItemSpy).toHaveBeenCalledTimes(1);
    expect(removeItemSpy).toHaveBeenCalledWith(storageKey);
  });

  it('returns an existing session id', () => {
    const session1 = sessionService.getSessionId();
    const session2 = sessionService.getSessionId();
    expect(session1).toEqual(session2);
  });
});
