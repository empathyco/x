import { DefaultSessionService } from '../session.service';
import { MockedStorageService } from './utils/mock-storage.service';

describe('testing session id service', () => {
  const prefix = 'test';
  const mockedStorageService = new MockedStorageService(prefix);
  const sessionService = new DefaultSessionService(mockedStorageService, 1);

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
    mockedStorageService.injectGetResponse('abcd-1234');
    const session = sessionService.getSessionId();
    expect(mockedStorageService.getPrefix()).toBe(prefix);
    expect(mockedStorageService.getSessionIdSpy).toHaveBeenCalledTimes(1);
    expect(mockedStorageService.setSessionIdSpy).toHaveBeenCalledTimes(1);
    expect(mockedStorageService.removeSessionIdSpy).not.toHaveBeenCalled();
    expect(mockedStorageService.setSessionIdSpy).toHaveBeenCalledWith(
      'session-id',
      'abcd-1234',
      expect.any(Number)
    );
    expect(session).toBe('abcd-1234');
  });

  it('removes an existing session id', () => {
    sessionService.clearSessionId();
    expect(mockedStorageService.getPrefix()).toBe(prefix);
    expect(mockedStorageService.getSessionIdSpy).not.toHaveBeenCalled();
    expect(mockedStorageService.setSessionIdSpy).not.toHaveBeenCalled();
    expect(mockedStorageService.removeSessionIdSpy).toHaveBeenCalledTimes(1);
  });
});
