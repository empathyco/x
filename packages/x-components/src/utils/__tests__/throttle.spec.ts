import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { throttle } from '../throttle'

describe('testing throttle util', () => {
  beforeAll(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.clearAllTimers()
  })

  it('only invokes the throttled function once if it is called multiple times', () => {
    const originalFn = vi.fn()
    const throttledFunction = throttle(originalFn, 100)

    throttledFunction(1)
    throttledFunction(2)
    throttledFunction(3)
    vi.advanceTimersByTime(99)
    expect(originalFn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1)
    expect(originalFn).toHaveBeenCalledTimes(1)
    expect(originalFn).toHaveBeenCalledWith(3)

    throttledFunction(4)
    vi.advanceTimersByTime(100)
    expect(originalFn).toHaveBeenCalledTimes(2)
    expect(originalFn).toHaveBeenLastCalledWith(4)
  })
})
