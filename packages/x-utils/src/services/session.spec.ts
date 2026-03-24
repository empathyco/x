import type { Mock } from 'vitest'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DefaultSessionService } from './session'
import { BrowserStorageService } from './storage/browser'
import { InMemoryStorageService } from './storage/in-memory'

describe('testing session id service', () => {
  const mockedStorageService = new InMemoryStorageService()
  const sessionService = new DefaultSessionService(mockedStorageService, 1)
  const storageKey = DefaultSessionService.SESSION_ID_KEY

  // eslint-disable-next-line no-restricted-globals
  const selfSpy = vi.spyOn(self, 'self', 'get') as Mock<
    () => { crypto: { randomUUID: () => string } }
  >

  selfSpy.mockImplementation(() => ({
    crypto: {
      randomUUID: () => Math.floor(Math.random() * 1000000000).toString(),
    },
  }))

  const getItemSpy = vi.spyOn(mockedStorageService, 'getItem')
  const setItemSpy = vi.spyOn(mockedStorageService, 'setItem')
  const removeItemSpy = vi.spyOn(mockedStorageService, 'removeItem')

  beforeEach(() => {
    vi.clearAllMocks()
    mockedStorageService.clear()
    vi.useFakeTimers()
  })

  it('creates a new session id when calling getSessionId and a session does not exist', () => {
    const session = sessionService.getSessionId()
    expect(getItemSpy).toHaveBeenCalledTimes(1)
    expect(setItemSpy).toHaveBeenCalledTimes(1)
    expect(setItemSpy).toHaveBeenCalledWith(storageKey, expect.any(String), expect.any(Number))
    expect(session).toMatch(/^[\w-]+$/)
  })

  it('removes an existing session id', () => {
    sessionService.clearSessionId()
    expect(removeItemSpy).toHaveBeenCalledTimes(1)
    expect(removeItemSpy).toHaveBeenCalledWith(storageKey)
  })

  it('returns an existing session id', () => {
    const session1 = sessionService.getSessionId()
    const session2 = sessionService.getSessionId()
    expect(session1).toEqual(session2)
  })

  it('generates a new session after ttl runs out', () => {
    const sessionService = new DefaultSessionService(new BrowserStorageService(localStorage), 1000)
    const session1 = sessionService.getSessionId()
    vi.advanceTimersByTime(999)
    const session2 = sessionService.getSessionId()
    expect(session1).toEqual(session2)
    vi.advanceTimersByTime(1000)
    const session3 = sessionService.getSessionId()
    expect(session1).not.toEqual(session3)
  })
})
