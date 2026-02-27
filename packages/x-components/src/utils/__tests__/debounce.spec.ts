import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { debounce } from '../debounce'

describe('testing debounce util', () => {
  beforeAll(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.clearAllTimers()
  })

  it('returns a function with cancel method', () => {
    const returnedFn = debounce(() => null, 100)
    expect(typeof returnedFn).toEqual('function')
    expect(typeof returnedFn.cancel).toEqual('function')
  })

  it('returns a function that calls the received function with a specified debounce', () => {
    const originalFn = vi.fn()
    const returnedFn = debounce(originalFn, 100)
    returnedFn()
    vi.advanceTimersByTime(50)
    expect(originalFn).not.toHaveBeenCalled()
    vi.advanceTimersByTime(50)
    expect(originalFn).toHaveBeenCalledTimes(1)
  })

  it('returns a function that calls the received function only once if the debounce time is not completed', () => {
    const originalFn = vi.fn()
    const returnedFn = debounce(originalFn, 100)
    returnedFn()
    vi.advanceTimersByTime(50)
    expect(originalFn).not.toHaveBeenCalled()
    returnedFn()
    returnedFn()
    vi.advanceTimersByTime(50)
    expect(originalFn).not.toHaveBeenCalled()
    returnedFn()
    vi.advanceTimersByTime(50)
    expect(originalFn).not.toHaveBeenCalled()
    vi.advanceTimersByTime(50)
    expect(originalFn).toHaveBeenCalledTimes(1)
  })

  it('returns a function that calls the received function with the same parameters of the last call', () => {
    const originalFn = vi.fn()
    const returnedFn = debounce(originalFn, 100)
    const args1 = ['Test1', 1, { a: 'b' }]
    const args2 = ['Test2', 2, { c: 'd' }]
    returnedFn(...args1)
    vi.advanceTimersByTime(50)
    returnedFn(...args2)
    vi.advanceTimersByTime(100)
    expect(originalFn).toHaveBeenCalledTimes(1)
    expect(originalFn).toHaveBeenCalledWith(...args2)
  })

  it('does not call the received function if is canceled before the debounceTime is completed', () => {
    const originalFn = vi.fn()
    const returnedFn = debounce(originalFn, 100)
    returnedFn()
    vi.advanceTimersByTime(50)
    returnedFn()
    vi.advanceTimersByTime(50)
    returnedFn.cancel()
    vi.advanceTimersByTime(100)
    expect(originalFn).not.toHaveBeenCalled()
  })

  it('calls the received function right away if the leading option is enabled', () => {
    const originalFn = vi.fn()
    const returnedFn = debounce(originalFn, 100, { leading: true })
    returnedFn()
    expect(originalFn).toHaveBeenCalledTimes(1)
  })

  it('when leading and trailing enabled the debounce executes once immediately and only has a trailing execution when a call happens during the debounce time', () => {
    const originalFn = vi.fn()
    const returnedFn = debounce(originalFn, 100, { leading: true })
    returnedFn()
    expect(originalFn).toHaveBeenCalledTimes(1)
    vi.advanceTimersByTime(99)
    expect(originalFn).toHaveBeenCalledTimes(1)
    vi.advanceTimersByTime(1)
    expect(originalFn).toHaveBeenCalledTimes(1)

    vi.clearAllMocks()

    returnedFn()
    expect(originalFn).toHaveBeenCalledTimes(1)
    returnedFn()
    vi.advanceTimersByTime(99)
    expect(originalFn).toHaveBeenCalledTimes(1)
    vi.advanceTimersByTime(1)
    expect(originalFn).toHaveBeenCalledTimes(2)
  })

  it("doesn't call the received function until after the debounceTime has been completed if the trailing option is disabled", () => {
    const originalFn = vi.fn()
    const returnedFn = debounce(originalFn, 100, { leading: true, trailing: false })
    returnedFn()
    expect(originalFn).toHaveBeenCalledTimes(1)
    returnedFn()
    returnedFn()
    vi.advanceTimersByTime(99)
    expect(originalFn).toHaveBeenCalledTimes(1)
    vi.advanceTimersByTime(1)
    expect(originalFn).toHaveBeenCalledTimes(1)
    vi.advanceTimersByTime(1)
    returnedFn()
    expect(originalFn).toHaveBeenCalledTimes(2)
  })
})
