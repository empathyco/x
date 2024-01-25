import { BrowserStorageService, InMemoryStorageService } from '@empathyco/x-storage-service';
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
    jest.useFakeTimers();
  });

  it('creates a new session id when calling getSessionId and a session does not exist', () => {
    const sessionId = 'beabb84c-c0aa-4d3a-911b-54779f7f4a8f';
    const session = mockedStorageService.getItem(storageKey) ?? sessionId;
    mockedStorageService.setItem(storageKey, sessionId);
    expect(getItemSpy).toHaveBeenCalledTimes(1);
    expect(setItemSpy).toHaveBeenCalledTimes(1);
    expect(setItemSpy).toHaveBeenCalledWith(storageKey, expect.any(String));
    expect(session).toMatch(/^[A-Za-z0-9_-]+$/);
  });

  it('removes an existing session id', () => {
    sessionService.clearSessionId();
    expect(removeItemSpy).toHaveBeenCalledTimes(1);
    expect(removeItemSpy).toHaveBeenCalledWith(storageKey);
  });

  it('returns an existing session id', () => {
    const session1Id = 'beabb84c-c0aa-4d3a-911b-54779f7f4a8f';
    mockedStorageService.setItem(storageKey, session1Id);
    const session2 = sessionService.getSessionId();
    expect(session1Id).toEqual(session2);
  });

  it('generates a new session after ttl runs out', () => {
    const sessionStorage = new BrowserStorageService(localStorage);
    const session1Id = 'beabb84c-c0aa-4d3a-911b-54779f7f4a8f';
    const session2Id = '350b1b9a-7bd2-499a-9506-e904c4121226';
    const session1 = sessionStorage.getItem(storageKey) ?? session1Id;
    sessionStorage.setItem(storageKey, session1, 1000);
    jest.advanceTimersByTime(999);
    const session2 = sessionStorage.getItem(storageKey);
    sessionStorage.setItem(storageKey, session1, 1000);
    expect(session1).toEqual(session2);
    jest.advanceTimersByTime(1001);
    const session3 = sessionStorage.getItem(storageKey) ?? session2Id;
    sessionStorage.setItem(storageKey, session1, 1000);
    expect(session1).not.toEqual(session3);
  });
});
