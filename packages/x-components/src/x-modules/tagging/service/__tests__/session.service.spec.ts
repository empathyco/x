import { InMemoryStorageService } from '@empathyco/x-storage-service';
import { DefaultSessionService } from '../session.service';

describe('testing session id service', () => {
  const mockedStorageService = new InMemoryStorageService();
  const getItemSpy = jest.spyOn(mockedStorageService, 'getItem');
  const setItemSpy = jest.spyOn(mockedStorageService, 'setItem');
  const removeItemSpy = jest.spyOn(mockedStorageService, 'removeItem');
  const sessionService = new DefaultSessionService(mockedStorageService, 1);
  const storageKey = sessionService.SESSION_ID_KEY;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates a new session id when calling getSessionId and a session does not exist', () => {
    const session = sessionService.getSessionId();
    expect(getItemSpy).toHaveBeenCalledTimes(1);
    expect(setItemSpy).toHaveBeenCalledTimes(1);
    expect(setItemSpy).toHaveBeenCalledWith(storageKey, expect.any(String), expect.any(Number));
    expect(session).toHaveLength(21);
    expect(session).toMatch(/[A-Za-z0-9_-]/);
  });

  it('returns an existing session id', () => {
    sessionService.getSessionId();
    expect(getItemSpy).toHaveBeenCalledTimes(1);
    expect(setItemSpy).toHaveBeenCalledTimes(1);
    expect(setItemSpy).toHaveBeenCalledWith(storageKey, expect.any(String), expect.any(Number));
  });

  it('removes an existing session id', () => {
    sessionService.clearSessionId();
    expect(removeItemSpy).toHaveBeenCalledTimes(1);
    expect(removeItemSpy).toHaveBeenCalledWith(storageKey);
  });
});
